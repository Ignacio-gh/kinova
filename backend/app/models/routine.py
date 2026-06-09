"""
routine.py — Asignación de un ejercicio a un paciente para un día de la semana.

Tabla: routines
Cada fila = "este paciente hace este ejercicio los lunes, X reps, Y series".
angle_min / angle_max son los ángulos por defecto; RoutineProgression los sobrescribe
semana a semana si el kine define una progresión.
"""

from sqlalchemy import Boolean, Enum, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Routine(Base, TimestampMixin):
    __tablename__ = "routines"
    __table_args__ = (
        # Cubre "rutinas de un paciente por día" (query más frecuente del pose engine)
        Index("ix_routines_patient_day", "patient_id", "day_of_week", "is_active"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profiles.id"), index=True)
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"))
    assigned_by_kinesiologo_id: Mapped[int | None] = mapped_column(
        ForeignKey("kinesiologo_profiles.id"), nullable=True
    )
    day_of_week: Mapped[str] = mapped_column(
        Enum("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
             name="day_of_week", create_type=False)
    )
    reps: Mapped[int] = mapped_column(Integer, default=10)
    sets: Mapped[int] = mapped_column(Integer, default=3)
    # ORM attributes usan angle_min/angle_max para coincidir con los schemas Pydantic.
    # Las columnas reales en PostgreSQL se llaman default_angle_min / default_angle_max.
    angle_min: Mapped[float | None] = mapped_column("default_angle_min", nullable=True)
    angle_max: Mapped[float | None] = mapped_column("default_angle_max", nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    patient: Mapped["PatientProfile"] = relationship(
        "PatientProfile", back_populates="routines"
    )
    exercise: Mapped["Exercise"] = relationship("Exercise", back_populates="routines")
    assigned_by: Mapped["KinesiologoProfile | None"] = relationship("KinesiologoProfile")
    progressions: Mapped[list["RoutineProgression"]] = relationship(
        "RoutineProgression", back_populates="routine", cascade="all, delete-orphan"
    )
    executions: Mapped[list["ExerciseExecution"]] = relationship(
        "ExerciseExecution", back_populates="routine"
    )
