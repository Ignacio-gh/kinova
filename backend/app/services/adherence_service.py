from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.timezone import APP_TIMEZONE, DAYS, local_week_start
from app.schemas.session import DashboardStats


async def calculate_weekly_adherence(
    db: AsyncSession,
    patient,
    week_offset: int = 0,
) -> float:
    """
    Calcula la adherencia de la semana actual: ejercicios completados desde
    el lunes sobre el total de ejercicios asignados en los días ya transcurridos
    de la semana (lunes a hoy inclusive). Los días futuros no cuentan todavía
    en el denominador — no es incumplimiento si el día no llegó. Devuelve
    porcentaje (0-100).
    """
    from app.models.routine import Routine
    from app.models.session import Session, ExerciseExecution

    week_start = local_week_start()
    elapsed_days = DAYS[: datetime.now(APP_TIMEZONE).weekday() + 1]

    # Rutinas asignadas en los días de la semana ya transcurridos
    assigned_result = await db.execute(
        select(func.count()).where(
            Routine.patient_id == patient.id,
            Routine.is_active == True,
            Routine.day_of_week.in_(elapsed_days),
        )
    )
    assigned = assigned_result.scalar_one() or 0

    if assigned == 0:
        return 0.0

    # Ejecuciones completadas desde el lunes de esta semana
    completed_result = await db.execute(
        select(func.count())
        .select_from(ExerciseExecution)
        .join(Session, Session.id == ExerciseExecution.session_id)
        .where(
            Session.patient_id == patient.id,
            ExerciseExecution.status == "completed",
            Session.started_at >= week_start,
        )
    )
    completed = completed_result.scalar_one() or 0

    return round(min(completed / assigned * 100, 100.0), 1)


async def calculate_avg_adherence_for_kine(
    db: AsyncSession,
    kine,
) -> float:
    """Promedio de adherencia de los pacientes activos del kine."""
    # TODO (modelos Agus): from app.models.patient import PatientProfile
    from app.models.patient import PatientProfile

    result = await db.execute(
        select(PatientProfile).where(
            PatientProfile.kinesiologo_id == kine.id,
            PatientProfile.status == "activo",
        )
    )
    active_patients = result.scalars().all()

    if not active_patients:
        return 0.0

    adherences = [
        await calculate_weekly_adherence(db, p) for p in active_patients
    ]
    return round(sum(adherences) / len(adherences), 1)


async def get_dashboard_stats(
    db: AsyncSession,
    patient,
) -> DashboardStats:
    # TODO (modelos Agus): from app.models.session import Session, ExerciseExecution
    from app.models.session import Session, ExerciseExecution

    sessions_result = await db.execute(
        select(Session).where(
            Session.patient_id == patient.id,
            Session.status == "completed",
        )
    )
    sessions = sessions_result.scalars().all()

    total_sessions = len(sessions)
    total_minutes = sum(
        int((s.ended_at - s.started_at).total_seconds() / 60)
        for s in sessions
        if s.ended_at and s.started_at
    )

    completed_result = await db.execute(
        select(func.count())
        .select_from(ExerciseExecution)
        .join(Session, Session.id == ExerciseExecution.session_id)
        .where(
            Session.patient_id == patient.id,
            ExerciseExecution.status == "completed",
        )
    )
    exercises_completed = completed_result.scalar_one() or 0

    avg_adherence = await calculate_weekly_adherence(db, patient)

    return DashboardStats(
        total_sessions=total_sessions,
        avg_adherence=avg_adherence,
        total_minutes=total_minutes,
        exercises_completed=exercises_completed,
    )
