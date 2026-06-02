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
    DashboardStats,
    KineStats,
    SessionExerciseDetail,
    SessionHistoryDetail,
)
from app.services import adherence_service

router = APIRouter()


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
