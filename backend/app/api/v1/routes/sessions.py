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
    patient=Depends(get_current_patient),
    db: AsyncSession = Depends(get_db),
):
    """
    Marca un ejercicio como completado.

    1. Busca o crea una sesion activa para hoy
    2. Crea un ExerciseExecution con status "completed"
    3. Cierra la sesion y calcula adherencia

    Esto es lo que llama el frontend cuando el paciente
    toca "Completado" en un ejercicio.
    """
    from datetime import datetime, timezone

    from app.models.routine import Routine
    from app.models.session import ExerciseExecution, Session

    # Buscar sesion activa de hoy, o crear una nueva
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0)
    result = await db.execute(
        select(Session).where(
            Session.patient_id == patient.id,
            Session.status == "active",
            Session.started_at >= today_start,
        )
    )
    session = result.scalar_one_or_none()

    if session is None:
        session = Session(
            patient_id=patient.id,
            status="active",
        )
        db.add(session)
        await db.flush()

    # Verificar que la rutina existe y es del paciente
    routine_result = await db.execute(
        select(Routine).where(
            Routine.id == data.routine_id,
            Routine.patient_id == patient.id,
        )
    )
    routine = routine_result.scalar_one_or_none()
    if routine is None:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rutina no encontrada",
        )

    # Verificar que no se haya completado ya en esta sesion
    existing = await db.execute(
        select(ExerciseExecution).where(
            ExerciseExecution.session_id == session.id,
            ExerciseExecution.routine_id == data.routine_id,
            ExerciseExecution.status == "completed",
        )
    )
    if existing.scalar_one_or_none() is not None:
        return CompleteExerciseResponse(
            message="Este ejercicio ya fue completado hoy",
            exercise_execution_id=existing.scalar_one_or_none().id if existing else 0,
            session_id=session.id,
        )

    # Crear la ejecucion completada
    execution = ExerciseExecution(
        session_id=session.id,
        routine_id=data.routine_id,
        target_reps=routine.reps,
        completed_reps=data.completed_reps or routine.reps,
        correct_reps=data.correct_reps,
        avg_score=data.avg_score,
        status="completed",
        ended_at=datetime.now(timezone.utc),
    )
    db.add(execution)
    await db.flush()

    # Actualizar la sesion
    session.ended_at = datetime.now(timezone.utc)
    if session.started_at:
        session.duration_minutes = int(
            (session.ended_at - session.started_at).total_seconds() / 60
        )
    session.status = "completed"

    # Calcular adherencia
    session.adherence_pct = await adherence_service.calculate_weekly_adherence(
        db, patient
    )

    return CompleteExerciseResponse(
        message="Ejercicio completado",
        exercise_execution_id=execution.id,
        session_id=session.id,
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
