"""
exercise.py — Catálogo de ejercicios.

Tabla: exercises

Responsabilidad:
    Definir los ejercicios disponibles para asignar.
    Es un catálogo controlado (no se crean desde la UI, se siembra con
    `scripts/seed_exercises.py`).

Campos planeados:
    - id (PK)
    - name (string)
    - zone (enum: "Rodilla" | "Cadera" | "Tobillo" | "Muslo" | "Glúteo")
    - description (text)
    - steps (JSON list de strings)
    - benefits (JSON list de strings)
    - image_url
    - video_url
    - evaluator_key (string, ej: "squat" | "knee_extension" | "straight_leg_raise")
       → este campo le dice al motor de pose qué evaluador cargar
    - default_landmarks_config (JSON, qué landmarks usar)
    - created_at

Relaciones:
    - routines: 1-a-N con Routine (cuántas veces fue asignado)
"""

# TODO: from sqlalchemy.orm import Mapped, mapped_column, relationship
# TODO: from sqlalchemy import Integer, String, JSON, Enum
# TODO: from app.models.base import Base, TimestampMixin
# TODO: class Exercise(Base, TimestampMixin): __tablename__ = "exercises"
