"""
base.py — Re-exportación de la Base y registro de modelos.

Responsabilidad:
    1. Re-exportar la `Base` declarativa para que Alembic la encuentre.
    2. Importar TODOS los modelos para que sus tablas queden registradas
       en `Base.metadata`. Si no se importan, Alembic no las ve.

IMPORTANTE:
    Alembic usa `Base.metadata` para autogenerar migraciones. Si agregás
    un modelo nuevo, hay que importarlo acá.
"""

# TODO: from app.models.base import Base
# TODO: from app.models.user import User
# TODO: from app.models.patient import PatientProfile
# TODO: from app.models.kinesiologo import KinesiologoProfile
# TODO: from app.models.exercise import Exercise
# TODO: from app.models.routine import Routine
# TODO: from app.models.progression import RoutineProgression
# TODO: from app.models.session import Session, ExerciseExecution
# TODO: from app.models.feedback_log import FeedbackLog
