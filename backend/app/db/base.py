"""
base.py — Registro central de todos los modelos de la base de datos.

QUE HACE ESTE ARCHIVO:
    Dos cosas simples:
    1. Re-exporta "Base" (la clase madre de todos los modelos)
    2. Importa TODOS los modelos para que queden registrados

POR QUE IMPORTAR TODOS LOS MODELOS ACA:
    SQLAlchemy y Alembic necesitan "ver" todos los modelos para saber
    que tablas crear en la base de datos. Si un modelo existe pero
    nadie lo importo, es como si no existiera — no se crea la tabla.

    Ejemplo: si creas el modelo Exercise en models/exercise.py pero
    no lo importas aca, cuando corras las migraciones (alembic),
    la tabla "exercises" NO se crea. Y te volves loco buscando por que.

    Este archivo es el "checklist" — si un modelo no esta importado
    aca abajo, no existe para la base de datos.

CUANDO AGREGAR ALGO ACA:
    Cada vez que alguien del equipo crea un modelo nuevo en app/models/,
    tiene que venir aca y agregar el import. Si no, no funciona.

NOTA:
    Los imports de abajo van a dar error ahora porque los modelos
    todavia son placeholders (solo tienen TODOs). Cuando implementemos
    los modelos en el paso 3, estos imports van a funcionar.
    Por ahora los dejamos comentados para que no explote.
"""

# La Base se importa del archivo donde se define (models/base.py)
# Todos los modelos heredan de esta clase.
# from app.models.base import Base

# ── Importar TODOS los modelos ────────────────────────────────
# (descomentar a medida que se implementen en el paso 3)
#
# from app.models.user import User
# from app.models.patient import PatientProfile
# from app.models.kinesiologo import KinesiologoProfile
# from app.models.exercise import Exercise
# from app.models.routine import Routine
# from app.models.progression import RoutineProgression
# from app.models.session import Session, ExerciseExecution
# from app.models.feedback_log import FeedbackLog
