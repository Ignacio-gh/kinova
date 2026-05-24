"""
progression.py — Progresión semanal de ángulos para una rutina.

Tabla: routine_progressions

Responsabilidad:
    Permitir al kinesiólogo definir cómo evoluciona el rango angular
    semana a semana. Ej:
        Semana 1: 60° - 70°
        Semana 2: 60° - 80°
        Semana 3: 60° - 90°

Campos planeados:
    - id (PK)
    - routine_id (FK routines)
    - week_number (int, ≥ 1)
    - angle_min (float, opcional)
    - angle_max (float, opcional)
    - reps_override (int, opcional)
    - sets_override (int, opcional)
    - notes (text, ej: "post-quirúrgico", "carga aumentada")
    - created_at, updated_at

Constraint:
    UNIQUE(routine_id, week_number)
    → No puede haber dos progresiones para la misma semana de una rutina.

Relaciones:
    - routine: N-a-1 con Routine

Lógica de resolución (en progression_service):
    Dada una semana actual W del paciente:
    1. Buscar progresión con week_number == W
    2. Si no existe, buscar la última con week_number ≤ W
    3. Si tampoco existe, usar Routine.default_angle_min/max
"""

# TODO: from sqlalchemy.orm import Mapped, mapped_column, relationship
# TODO: from sqlalchemy import Integer, Float, Text, ForeignKey, UniqueConstraint
# TODO: from app.models.base import Base, TimestampMixin
# TODO: class RoutineProgression(Base, TimestampMixin): __tablename__ = "routine_progressions"
