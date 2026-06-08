"""
session_repository.py — Acceso a datos de Sessions, ExerciseExecutions y FeedbackLogs.

Usa selectinload para cargar relaciones en una segunda query (evita N+1).
No usa joinedload porque genera un JOIN por cada relación → más costoso
cuando la lista de ejecuciones o feedback puede ser larga.
"""

from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.feedback_log import FeedbackLog
from app.models.session import ExerciseExecution, Session
from app.repositories.base import BaseRepository


class SessionRepository(BaseRepository[Session]):
    model = Session

    async def get_by_id(self, db: AsyncSession, session_id: int) -> Session | None:
        result = await db.execute(
            select(Session)
            .where(Session.id == session_id)
            .options(selectinload(Session.executions))
        )
        return result.scalar_one_or_none()

    async def list_for_patient(
        self, db: AsyncSession, patient_id: int, limit: int = 20, offset: int = 0
    ) -> list[Session]:
        result = await db.execute(
            select(Session)
            .where(Session.patient_id == patient_id)
            .order_by(Session.started_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def get_active_for_patient(
        self, db: AsyncSession, patient_id: int
    ) -> Session | None:
        # Usa el índice compuesto ix_sessions_patient_status
        result = await db.execute(
            select(Session)
            .where(Session.patient_id == patient_id, Session.status == "active")
            .options(selectinload(Session.executions))
        )
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, patient_id: int) -> Session:
        return await super().create(db, patient_id=patient_id)

    async def close(
        self,
        db: AsyncSession,
        session_id: int,
        ended_at: datetime,
        adherence_pct: float | None = None,
    ) -> Session | None:
        session = await self.get(db, session_id)
        if session is None:
            return None
        duration = int((ended_at - session.started_at).total_seconds() / 60)
        return await super().update(
            db,
            session_id,
            ended_at=ended_at,
            duration_minutes=duration,
            adherence_pct=adherence_pct,
            status="completed",
        )


class ExerciseExecutionRepository(BaseRepository[ExerciseExecution]):
    model = ExerciseExecution

    async def create_execution(
        self,
        db: AsyncSession,
        session_id: int,
        routine_id: int | None,
        target_reps: int | None,
        angle_min: float | None = None,
        angle_max: float | None = None,
    ) -> ExerciseExecution:
        return await super().create(
            db,
            session_id=session_id,
            routine_id=routine_id,
            target_reps=target_reps,
            effective_angle_min=angle_min,
            effective_angle_max=angle_max,
        )

    async def complete_execution(
        self,
        db: AsyncSession,
        exec_id: int,
        completed_reps: int,
        correct_reps: int,
        avg_score: float | None = None,
    ) -> ExerciseExecution | None:
        return await super().update(
            db,
            exec_id,
            completed_reps=completed_reps,
            correct_reps=correct_reps,
            avg_score=avg_score,
            ended_at=datetime.utcnow(),
            status="completed",
        )

    async def list_for_session(
        self, db: AsyncSession, session_id: int
    ) -> list[ExerciseExecution]:
        # Usa ix_exercise_executions_session_status (session_id es el prefijo)
        result = await db.execute(
            select(ExerciseExecution)
            .where(ExerciseExecution.session_id == session_id)
            .options(selectinload(ExerciseExecution.feedback_logs))
            .order_by(ExerciseExecution.started_at)
        )
        return list(result.scalars().all())

    async def count_completed_for_week(
        self, db: AsyncSession, patient_id: int, week_start: datetime
    ) -> int:
        # Usa ix_exercise_executions_started_at para filtrar por fecha
        result = await db.execute(
            select(func.count(ExerciseExecution.id))
            .join(Session, ExerciseExecution.session_id == Session.id)
            .where(
                Session.patient_id == patient_id,
                ExerciseExecution.started_at >= week_start,
                ExerciseExecution.status == "completed",
            )
        )
        return result.scalar_one()


class FeedbackLogRepository(BaseRepository[FeedbackLog]):
    model = FeedbackLog

    async def log_feedback(
        self,
        db: AsyncSession,
        execution_id: int,
        correction_type: str,
        message: str | None,
        severity: str,
        joint_angles: dict | None = None,
    ) -> FeedbackLog:
        return await super().create(
            db,
            exercise_execution_id=execution_id,
            correction_type=correction_type,
            message=message,
            severity=severity,
            joint_angles_snapshot=joint_angles,
        )

    async def list_for_execution(
        self, db: AsyncSession, execution_id: int
    ) -> list[FeedbackLog]:
        # Usa ix_feedback_logs_exercise_execution_id
        result = await db.execute(
            select(FeedbackLog)
            .where(FeedbackLog.exercise_execution_id == execution_id)
            .order_by(FeedbackLog.timestamp)
        )
        return list(result.scalars().all())
