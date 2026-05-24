"""
user.py — Modelo de cuenta de usuario.

Tabla: users

Responsabilidad:
    Representar la cuenta básica de cualquier usuario (paciente o kine).
    Los datos específicos de cada role están en `patient.py` o `kinesiologo.py`
    (patrón de "perfil extendido").

Campos planeados:
    - id (PK)
    - email (unique, indexed)
    - password_hash
    - full_name
    - role: enum ("paciente" | "kinesiologo")
    - is_active: bool
    - created_at, updated_at

Relaciones:
    - patient_profile: 1-a-1 con PatientProfile (si role=paciente)
    - kinesiologo_profile: 1-a-1 con KinesiologoProfile (si role=kinesiologo)

Rol arquitectónico:
    Tabla central de auth. Todo lo demás cuelga de acá.
"""

# TODO: from sqlalchemy.orm import Mapped, mapped_column, relationship
# TODO: from sqlalchemy import String, Boolean, Enum
# TODO: from app.models.base import Base, TimestampMixin
# TODO: class User(Base, TimestampMixin): __tablename__ = "users"
