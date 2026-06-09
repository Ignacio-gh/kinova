"""
feedback_log.py — Registro de correcciones puntuales durante una ejecución.

Tabla: feedback_logs

Responsabilidad:
    Cada vez que el motor de pose detecta una corrección (ej: "rodilla
    pasando el pie"), se guarda un registro. Permite al kine revisar
    después qué errores tuvo el paciente durante una sesión.

Campos planeados:
    - id (PK)
    - exercise_execution_id (FK exercise_executions)
    - timestamp (datetime, momento exacto del frame)
    - correction_type (string, ej: "knee_past_toe", "trunk_lean")
    - message (string, mensaje que se le mostró al paciente)
    - severity: enum ("info" | "improve" | "bad")
    - joint_angles_snapshot (JSON, ángulos en ese momento)

Frecuencia:
    Solo se loguea cuando hay corrección. No se guardan los frames "ok"
    para no inflar la DB.

Relaciones:
    - exercise_execution: N-a-1 con ExerciseExecution
"""

# TODO: from sqlalchemy.orm import Mapped, mapped_column, relationship
# TODO: from sqlalchemy import Integer, String, DateTime, JSON, Enum, ForeignKey
# TODO: from app.models.base import Base
# TODO: class FeedbackLog(Base): __tablename__ = "feedback_logs"
