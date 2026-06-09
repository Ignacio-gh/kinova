"""
user.py — Modelo de cuenta de usuario.

Tabla: users

Cada persona que se registra en Kinova tiene un registro aca.
El campo 'role' define si es paciente o kinesiologo, y los datos
especificos de cada rol van en las tablas patient_profiles o
kinesiologo_profiles (relacion 1-a-1).
"""

from sqlalchemy import Boolean, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(
        Enum("paciente", "kinesiologo", name="user_role", create_type=False)
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relaciones 1-a-1 con los perfiles
    patient_profile: Mapped["PatientProfile | None"] = relationship(
        "PatientProfile", back_populates="user", uselist=False,
    )
    kinesiologo_profile: Mapped["KinesiologoProfile | None"] = relationship(
        "KinesiologoProfile", back_populates="user", uselist=False,
    )
