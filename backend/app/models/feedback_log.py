"""
feedback_log.py — Correcciones puntuales del motor de pose.

Tabla: feedback_logs
Log inmutable: solo se insertan registros, nunca se modifican.
Solo se guarda cuando hay una corrección; los frames "ok" no se persisten.
"""

from datetime import datetime

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class FeedbackLog(Base):
    __tablename__ = "feedback_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    exercise_execution_id: Mapped[int] = mapped_column(
        ForeignKey("exercise_executions.id"), index=True
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
    correction_type: Mapped[str] = mapped_column(String(100))
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    severity: Mapped[str] = mapped_column(
        Enum("info", "improve", "bad", name="feedback_severity", create_type=False),
        default="info",
    )
    joint_angles_snapshot: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    execution: Mapped["ExerciseExecution"] = relationship(
        "ExerciseExecution", back_populates="feedback_logs"
    )
