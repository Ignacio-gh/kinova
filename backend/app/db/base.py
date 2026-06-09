"""
base.py — Registro central de todos los modelos.

Importa todos los modelos para que SQLAlchemy y Alembic los vean.
"""

from app.models.base import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.kinesiologo import KinesiologoProfile  # noqa: F401
from app.models.patient import PatientProfile  # noqa: F401
from app.models.exercise import Exercise  # noqa: F401
from app.models.routine import Routine  # noqa: F401
from app.models.progression import RoutineProgression  # noqa: F401
from app.models.session import Session, ExerciseExecution  # noqa: F401
from app.models.feedback_log import FeedbackLog  # noqa: F401
