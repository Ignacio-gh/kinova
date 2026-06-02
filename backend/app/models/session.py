"""
session.py — Sesiones de ejercicio y ejecuciones individuales.

Tablas: sessions, exercise_executions

Una Session agrupa todas las ejecuciones de una apertura de la app.
Cada ExerciseExecution registra un ejercicio realizado dentro de esa sesión.
"""

from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Session(Base, TimestampMixin):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profiles.id"))
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    duration_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("active", "completed", "abandoned", name="session_status", create_type=False),
        default="active",
    )
    adherence_pct: Mapped[float | None] = mapped_column(nullable=True)

    patient: Mapped["PatientProfile"] = relationship(
        "PatientProfile", back_populates="sessions"
    )
    executions: Mapped[list["ExerciseExecution"]] = relationship(
        "ExerciseExecution", back_populates="session", cascade="all, delete-orphan"
    )


class ExerciseExecution(Base, TimestampMixin):
    __tablename__ = "exercise_executions"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("sessions.id"))
    routine_id: Mapped[int | None] = mapped_column(ForeignKey("routines.id"), nullable=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    target_reps: Mapped[int | None] = mapped_column(Integer, nullable=True)
    completed_reps: Mapped[int] = mapped_column(Integer, default=0)
    correct_reps: Mapped[int] = mapped_column(Integer, default=0)
    effective_angle_min: Mapped[float | None] = mapped_column(nullable=True)
    effective_angle_max: Mapped[float | None] = mapped_column(nullable=True)
    avg_score: Mapped[float | None] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("active", "completed", "abandoned", name="execution_status", create_type=False),
        default="active",
    )

    session: Mapped["Session"] = relationship("Session", back_populates="executions")
    routine: Mapped["Routine | None"] = relationship("Routine", back_populates="executions")
    feedback_logs: Mapped[list["FeedbackLog"]] = relationship(
        "FeedbackLog", back_populates="execution", cascade="all, delete-orphan"
    )
