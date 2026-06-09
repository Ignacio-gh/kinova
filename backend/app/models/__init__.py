"""
app/models/ — Modelos ORM de SQLAlchemy.

Importamos todos los modelos acá para que SQLAlchemy resuelva
las relaciones entre tablas correctamente. El orden importa:
primero los modelos sin dependencias, luego los que tienen FKs.
"""

from app.models.base import Base, TimestampMixin
from app.models.user import User
from app.models.kinesiologo import KinesiologoProfile
from app.models.patient import PatientProfile
from app.models.exercise import Exercise
from app.models.routine import Routine
from app.models.progression import RoutineProgression
from app.models.session import Session, ExerciseExecution
from app.models.feedback_log import FeedbackLog

__all__ = [
    "Base",
    "TimestampMixin",
    "User",
    "KinesiologoProfile",
    "PatientProfile",
    "Exercise",
    "Routine",
    "RoutineProgression",
    "Session",
    "ExerciseExecution",
    "FeedbackLog",
]
