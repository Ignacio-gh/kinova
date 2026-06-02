"""
progression.py — Progresión angular semana a semana para una rutina.

Tabla: routine_progressions
El kine define ángulos y reps/sets por semana. Si no hay progresión para
la semana actual, el servicio cae al último valor definido o a los
defaults de la Routine.
"""

from sqlalchemy import ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class RoutineProgression(Base, TimestampMixin):
    __tablename__ = "routine_progressions"
    __table_args__ = (
        UniqueConstraint("routine_id", "week_number", name="uq_routine_week"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    routine_id: Mapped[int] = mapped_column(ForeignKey("routines.id"))
    week_number: Mapped[int] = mapped_column(Integer)
    angle_min: Mapped[float | None] = mapped_column(nullable=True)
    angle_max: Mapped[float | None] = mapped_column(nullable=True)
    reps_override: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sets_override: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    routine: Mapped["Routine"] = relationship("Routine", back_populates="progressions")
