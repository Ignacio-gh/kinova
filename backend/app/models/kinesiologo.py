"""
kinesiologo.py — Perfil profesional del kinesiologo.

Tabla: kinesiologo_profiles

Datos profesionales: matricula, credencial, especialidad.
Relacion 1-a-1 con User (el kine es un User con role="kinesiologo").
"""

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class KinesiologoProfile(Base, TimestampMixin):
    __tablename__ = "kinesiologo_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), unique=True,
    )
    matricula: Mapped[str] = mapped_column(String(20))
    credencial_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    especialidad: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Relaciones
    user: Mapped["User"] = relationship("User", back_populates="kinesiologo_profile")
    patients: Mapped[list["PatientProfile"]] = relationship(
        "PatientProfile", back_populates="kinesiologo",
    )
