"""
session.py — Sesiones de ejercicio realizadas por el paciente.

Tablas: sessions, exercise_executions

Responsabilidad:
    Registrar cada vez que el paciente abre la app y ejecuta uno o más
    ejercicios. Permite calcular adherencia, ver historial, y al kine
    revisar el progreso.

Modelo conceptual:
    Session (1 por apertura de app)
      └── ExerciseExecution (N, una por ejercicio realizado en esa sesión)
            └── FeedbackLog (N, correcciones puntuales — ver feedback_log.py)

Session — Campos planeados:
    - id (PK)
    - patient_id (FK patient_profiles)
    - started_at (datetime)
    - ended_at (datetime, nullable mientras está activa)
    - duration_minutes (int, calculado al cerrar)
    - status: enum ("active" | "completed" | "abandoned")
    - adherence_pct (float, % completado vs asignado, calculado al cerrar)

ExerciseExecution — Campos planeados:
    - id (PK)
    - session_id (FK sessions)
    - routine_id (FK routines)  → para saber qué se intentó hacer
    - started_at, ended_at
    - target_reps, completed_reps, correct_reps
    - effective_angle_min, effective_angle_max  → ángulos vigentes en esa semana
    - avg_score (float 0-100)
    - status: enum ("active" | "completed" | "abandoned")

Relaciones:
    - Session ─< ExerciseExecution ─< FeedbackLog
"""

# TODO: from sqlalchemy.orm import Mapped, mapped_column, relationship
# TODO: from sqlalchemy import Integer, Float, DateTime, Enum, ForeignKey
# TODO: from app.models.base import Base, TimestampMixin
# TODO: class Session(Base, TimestampMixin): __tablename__ = "sessions"
# TODO: class ExerciseExecution(Base, TimestampMixin): __tablename__ = "exercise_executions"
