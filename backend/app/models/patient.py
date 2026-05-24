"""
patient.py — Perfil extendido del paciente.

Tabla: patient_profiles

Responsabilidad:
    Datos específicos del paciente (relación 1-a-1 con User).

Campos planeados:
    - id (PK)
    - user_id (FK users, unique)
    - kinesiologo_id (FK kinesiologo_profiles)  → quién lo trata
    - phone
    - birth_date
    - diagnosis (text)
    - notes (text, notas clínicas)
    - treatment_weeks (int, duración total del tratamiento)
    - treatment_start_date (date)
    - status: enum ("activo" | "finalizado")
    - created_at, updated_at

Relaciones:
    - user: 1-a-1 con User
    - kinesiologo: N-a-1 con KinesiologoProfile
    - routines: 1-a-N con Routine
    - sessions: 1-a-N con Session

Cálculo derivado importante:
    current_week = (today - treatment_start_date) / 7
    → usado por progression_service para resolver ángulos efectivos
"""

# TODO: from sqlalchemy.orm import Mapped, mapped_column, relationship
# TODO: from sqlalchemy import Integer, String, Date, ForeignKey, Enum
# TODO: from app.models.base import Base, TimestampMixin
# TODO: class PatientProfile(Base, TimestampMixin): __tablename__ = "patient_profiles"
