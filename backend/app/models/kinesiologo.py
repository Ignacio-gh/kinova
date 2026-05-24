"""
kinesiologo.py — Perfil extendido del kinesiólogo.

Tabla: kinesiologo_profiles

Responsabilidad:
    Datos profesionales del kinesiólogo (relación 1-a-1 con User).

Campos planeados:
    - id (PK)
    - user_id (FK users, unique)
    - matricula (string, identificación profesional)
    - credencial_url (string, URL/path al PDF de la credencial)
    - especialidad (string, opcional)
    - created_at, updated_at

Relaciones:
    - user: 1-a-1 con User
    - patients: 1-a-N con PatientProfile
    - routines: 1-a-N con Routine (las asignadas por este kine)
"""

# TODO: from sqlalchemy.orm import Mapped, mapped_column, relationship
# TODO: from sqlalchemy import Integer, String, ForeignKey
# TODO: from app.models.base import Base, TimestampMixin
# TODO: class KinesiologoProfile(Base, TimestampMixin): __tablename__ = "kinesiologo_profiles"
