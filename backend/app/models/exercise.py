"""
exercise.py — Catálogo de ejercicios.

Tabla: exercises
Catálogo controlado; se puebla con 02_seed_exercises.sql.
Sin updated_at — es un catálogo inmutable (solo lo edita el equipo).
"""

from datetime import datetime

from sqlalchemy import DateTime, Enum, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)
    zone: Mapped[str] = mapped_column(
        Enum("Rodilla", "Cadera", "Tobillo", "Muslo", "Glúteo", name="exercise_zone", create_type=False)
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    steps: Mapped[list] = mapped_column(JSONB, default=list)
    benefits: Mapped[list] = mapped_column(JSONB, default=list)
    target_muscles: Mapped[list] = mapped_column(JSONB, default=list)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    video_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    evaluator_key: Mapped[str | None] = mapped_column(String(50), nullable=True)
    default_landmarks_config: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    routines: Mapped[list["Routine"]] = relationship("Routine", back_populates="exercise")
