"""
sessions.py — Endpoints de historial y estadísticas de sesiones.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.dependencies import (
    get_current_kinesiologo,
    get_current_patient,
    get_current_user,
    get_db,
    verify_patient_belongs_to_kine,
)
from app.schemas.session import (
    CompleteExerciseRequest,
    CompleteExerciseResponse,
    DashboardStats,
    KineStats,
    SessionExerciseDetail,
    SessionHistoryDetail,
)
from app.services import adherence_service

router = APIRouter()


# ── Completar un ejercicio (lo que faltaba) ──────────────────────────────────

@router.post("/complete-exercise", response_model=CompleteExerciseResponse)
async def complete_exercise(
    data: CompleteExerciseRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Marca un ejercicio como completado.
    """
    from datetime import datetime, timezone

    from fastapi import HTTPException, status

    from app.core.timezone import local_today_bounds
    from app.models.patient import PatientProfile
    from app.models.routine import Routine
    from app.models.session import ExerciseExecution, Session

    # Buscar paciente en la MISMA sesion de DB
    patient_result = await db.execute(
        select(PatientProfile).where(PatientProfile.user_id == current_user.id)
    )
    patient = patient_result.scalar_one_or_none()
    if patient is None:
        raise HTTPException(status_code=403, detail="No sos paciente")

    now = datetime.now(timezone.utc)
    today_start, _ = local_today_bounds()

    # 1. Buscar o crear sesion de hoy
    # order_by + limit(1): si ya existe mas de una sesion de hoy (pruebas
    # repetidas, doble clic), tomamos la mas reciente en vez de explotar
    # con MultipleResultsFound.
    result = await db.execute(
        select(Session)
        .where(
            Session.patient_id == patient.id,
            Session.started_at >= today_start,
        )
        .order_by(Session.started_at.desc())
        .limit(1)
    )
    session = result.scalar_one_or_none()

    if session is None:
        session = Session(patient_id=patient.id, status="active", started_at=now)
        db.add(session)
        await db.flush()

    # 2. Verificar que la rutina existe y es del paciente
    routine_result = await db.execute(
        select(Routine).where(
            Routine.id == data.routine_id,
            Routine.patient_id == patient.id,
        )
    )
    routine = routine_result.scalar_one_or_none()
    if routine is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rutina no encontrada",
        )

    # 3. Verificar que no se haya completado ya HOY (en cualquier sesion de hoy)
    existing_result = await db.execute(
        select(ExerciseExecution)
        .join(Session, Session.id == ExerciseExecution.session_id)
        .where(
            Session.patient_id == patient.id,
            ExerciseExecution.routine_id == data.routine_id,
            ExerciseExecution.status == "completed",
            Session.started_at >= today_start,
        )
        .limit(1)
    )
    already_done = existing_result.scalar_one_or_none()
    if already_done is not None:
        return CompleteExerciseResponse(
            message="Ya completado",
            exercise_execution_id=already_done.id,
            session_id=session.id,
        )

    # 4. Crear ejecucion completada
    execution = ExerciseExecution(
        session_id=session.id,
        routine_id=data.routine_id,
        target_reps=routine.reps,
        completed_reps=data.completed_reps or routine.reps,
        correct_reps=data.correct_reps,
        avg_score=data.avg_score,
        status="completed",
        ended_at=now,
    )
    db.add(execution)
    await db.flush()

    # 5. Guardar IDs antes de tocar la sesion
    exec_id = execution.id
    sess_id = session.id

    # 6. Calcular adherencia del dia: completados hoy / asignados para hoy
    # (misma formula que usa el resto de la app, evita que ambos calculos diverjan)
    adherence = await adherence_service.calculate_weekly_adherence(db, patient)

    # 7. Actualizar sesion
    session.ended_at = now
    session.status = "completed"
    session.duration_minutes = max(
        int((now - session.started_at).total_seconds() / 60), 0
    )
    session.adherence_pct = adherence

    return CompleteExerciseResponse(
        message="Ejercicio completado",
        exercise_execution_id=exec_id,
        session_id=sess_id,
    )


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _build_history(db: AsyncSession, patient_id: int) -> list[SessionHistoryDetail]:
    from app.models.exercise import Exercise
    from app.models.routine import Routine
    from app.models.session import ExerciseExecution, Session

    result = await db.execute(
        select(Session)
        .where(Session.patient_id == patient_id, Session.status == "completed")
        .order_by(Session.started_at.desc())
        .options(
            selectinload(Session.executions)
            .selectinload(ExerciseExecution.routine)
            .selectinload(Routine.exercise)
        )
    )
    sessions = result.scalars().all()

    history: list[SessionHistoryDetail] = []
    for s in sessions:
        exercises: list[SessionExerciseDetail] = []
        for ex in s.executions:
            if ex.routine and ex.routine.exercise:
                exercises.append(
                    SessionExerciseDetail(
                        name=ex.routine.exercise.name,
                        sets=ex.routine.sets,
                        reps=ex.target_reps or ex.routine.reps,
                        completed=ex.status == "completed",
                    )
                )
        history.append(
            SessionHistoryDetail(
                id=s.id,
                date=s.started_at,
                duration_minutes=s.duration_minutes,
                adherence_pct=s.adherence_pct,
                exercises=exercises,
            )
        )

    return history


# ── Endpoints del paciente ────────────────────────────────────────────────────

@router.get("/me/stats", response_model=DashboardStats)
async def get_my_stats(
    patient=Depends(get_current_patient),
    db: AsyncSession = Depends(get_db),
):
    return await adherence_service.get_dashboard_stats(db, patient)


@router.get("/me/history", response_model=list[SessionHistoryDetail])
async def get_my_history(
    patient=Depends(get_current_patient),
    db: AsyncSession = Depends(get_db),
):
    return await _build_history(db, patient.id)


# ── Endpoints del kinesiólogo sobre sus pacientes ─────────────────────────────

@router.get("/patient/{patient_id}/stats", response_model=DashboardStats)
async def get_patient_stats(
    patient=Depends(verify_patient_belongs_to_kine),
    db: AsyncSession = Depends(get_db),
):
    return await adherence_service.get_dashboard_stats(db, patient)


@router.get("/patient/{patient_id}/history", response_model=list[SessionHistoryDetail])
async def get_patient_history(
    patient=Depends(verify_patient_belongs_to_kine),
    db: AsyncSession = Depends(get_db),
):
    return await _build_history(db, patient.id)


# ── Stats globales del kinesiólogo ────────────────────────────────────────────

@router.get("/kine/stats", response_model=KineStats)
async def get_kine_stats(
    kine=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    from app.models.patient import PatientProfile
    from app.models.session import Session

    active_result = await db.execute(
        select(func.count()).where(
            PatientProfile.kinesiologo_id == kine.id,
            PatientProfile.status == "activo",
        )
    )
    active_patients = active_result.scalar_one() or 0

    total_result = await db.execute(
        select(func.count())
        .select_from(Session)
        .join(PatientProfile, PatientProfile.id == Session.patient_id)
        .where(
            PatientProfile.kinesiologo_id == kine.id,
            Session.status == "completed",
        )
    )
    total_sessions = total_result.scalar_one() or 0

    avg_adherence = await adherence_service.calculate_avg_adherence_for_kine(db, kine)

    return KineStats(
        active_patients=active_patients,
        total_sessions=total_sessions,
        avg_adherence=avg_adherence,
    )
