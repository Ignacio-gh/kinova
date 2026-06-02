"""
patient.py — Perfil del paciente.

Tabla: patient_profiles

Datos clinicos: diagnostico, semanas de tratamiento, fecha de inicio,
estado (activo/finalizado). Relacion 1-a-1 con User.
"""

from datetime import date

from sqlalchemy import Date, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class PatientProfile(Base, TimestampMixin):
    __tablename__ = "patient_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), unique=True,
    )
    kinesiologo_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("kinesiologo_profiles.id"),
    )
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    birth_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    diagnosis: Mapped[str] = mapped_column(Text)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    treatment_weeks: Mapped[int] = mapped_column(Integer)
    treatment_start_date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(
        Enum("activo", "finalizado", name="patient_status", create_type=False),
        default="activo",
    )

    # Relaciones
    user: Mapped["User"] = relationship("User", back_populates="patient_profile")
    kinesiologo: Mapped["KinesiologoProfile"] = relationship(
        "KinesiologoProfile", back_populates="patients",
    )
    routines: Mapped[list["Routine"]] = relationship(
        "Routine", back_populates="patient"
    )
    sessions: Mapped[list["Session"]] = relationship(
        "Session", back_populates="patient"
    )
