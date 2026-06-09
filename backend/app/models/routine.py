"""
routine.py — Asignación de un ejercicio a un paciente para un día.

Tabla: routines

Responsabilidad:
    Representa "este paciente, los lunes, hace este ejercicio, con
    estas reps/series y este rango angular default".

Campos planeados:
    - id (PK)
    - patient_id (FK patient_profiles)
    - exercise_id (FK exercises)
    - assigned_by_kinesiologo_id (FK kinesiologo_profiles)
    - day_of_week: enum ("monday", "tuesday", ..., "sunday")
    - reps (int)
    - sets (int)
    - default_angle_min (float, opcional)
    - default_angle_max (float, opcional)
    - is_active (bool, soft delete)
    - created_at, updated_at

Relaciones:
    - patient: N-a-1 con PatientProfile
    - exercise: N-a-1 con Exercise
    - assigned_by: N-a-1 con KinesiologoProfile
    - progressions: 1-a-N con RoutineProgression

Nota sobre defaults vs progresión:
    Los ángulos default se usan si NO hay progresión definida para la
    semana actual del paciente. La progresión los sobrescribe.
"""

# TODO: from sqlalchemy.orm import Mapped, mapped_column, relationship
# TODO: from sqlalchemy import Integer, Float, Boolean, ForeignKey, Enum
# TODO: from app.models.base import Base, TimestampMixin
# TODO: class Routine(Base, TimestampMixin): __tablename__ = "routines"
