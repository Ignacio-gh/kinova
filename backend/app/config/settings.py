"""
settings.py — Configuracion tipada del backend Kinova.

QUE HACE ESTE ARCHIVO:
    Lee las variables del archivo `.env` y las convierte en un objeto
    Python con tipos validados. Si alguien pone "hola" donde deberia
    ir un numero, Pydantic tira error al arrancar el servidor — no
    en runtime cuando ya es tarde.

POR QUE EXISTE:
    Sin esto, tendrias que escribir os.environ["SECRET_KEY"] en cada
    archivo que necesite una config. Si te equivocas en el nombre del
    string, Python no te avisa hasta que explota. Con Settings, tenes
    autocompletado, tipo seguro, y un solo lugar donde cambiar todo.

COMO SE USA EN OTROS ARCHIVOS:
    from app.config.settings import settings

    db_url = settings.DATABASE_URL     # string, validado
    debug  = settings.DEBUG            # bool, ya parseado
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Cada atributo de esta clase es una variable de entorno.
    Pydantic las lee automaticamente del .env y las castea al tipo
    que vos declaras aca.

    Ejemplo:
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
        ─────────────────────────── ───   ────
        nombre en el .env          tipo   valor por defecto
                                          (si no esta en .env, usa este)
    """

    # ── Base de datos ──────────────────────────────────────────
    # La URL completa de conexion. En desarrollo usamos SQLite
    # (archivo local), en produccion sera PostgreSQL.
    # No tiene default → si falta en el .env, Pydantic tira error.
    # Eso es intencional: sin base de datos el server no deberia arrancar.
    DATABASE_URL: str

    # ── Autenticacion JWT ──────────────────────────────────────
    # SECRET_KEY: la clave con la que se firman los tokens JWT.
    # Si alguien la descubre, puede fabricar tokens falsos.
    # Por eso no tiene default: te obliga a definirla en .env.
    SECRET_KEY: str

    # ALGORITHM: algoritmo de firma. HS256 = HMAC con SHA-256.
    # Es el estandar para JWTs simetricos (una sola clave).
    # Default "HS256" porque casi nunca se cambia.
    ALGORITHM: str = "HS256"

    # Cuantos minutos dura un token antes de expirar.
    # 1440 min = 24 horas. Para un MVP de rehab en casa esta bien,
    # el paciente no quiere loguearse cada 30 minutos.
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # ── CORS ───────────────────────────────────────────────────
    # URL del frontend. El backend solo acepta requests de este
    # origen. Sin esto, el browser bloquea las llamadas del React.
    # Default: puerto 5173 porque Vite (que usa el front) usa ese.
    FRONTEND_URL: str = "http://localhost:5173"

    # ── Motor de Pose (MediaPipe) ──────────────────────────────
    # Confianza minima para aceptar un landmark detectado.
    # 0.5 = 50%. Si MediaPipe esta menos del 50% seguro de donde
    # esta la rodilla, lo descartamos. Muy bajo → ruido,
    # muy alto → se pierden frames validos.
    POSE_CONFIDENCE_THRESHOLD: float = 0.5

    # Complejidad del modelo de pose: 0 (rapido), 1 (balanceado), 2 (preciso).
    # 1 es el sweet spot para una webcam comun en casa.
    POSE_MODEL_COMPLEXITY: int = 1

    # ── Entorno ────────────────────────────────────────────────
    # "development", "staging" o "production".
    # Se usa para decidir cosas como: mostrar docs de Swagger? Loguear SQL?
    ENVIRONMENT: str = "development"

    # En True activa logs detallados y la documentacion interactiva (/docs).
    # En produccion va en False.
    DEBUG: bool = True

    # ── Configuracion de Pydantic Settings ─────────────────────
    model_config = SettingsConfigDict(
        # Donde buscar las variables de entorno.
        # Ruta relativa al working directory (desde donde corres uvicorn).
        env_file=".env",

        # Si el .env tiene variables que no estan declaradas arriba,
        # las ignora en vez de tirar error. Util porque el .env puede
        # tener cosas de otros servicios (Docker, etc).
        extra="ignore",
    )


# ── Instancia global (singleton) ──────────────────────────────
# Se crea UNA sola vez cuando Python importa este modulo.
# Despues todos los archivos importan esta misma instancia.
# ¿Por que no crear una nueva Settings() en cada archivo?
# Porque leeria el .env de nuevo cada vez — innecesario y lento.
settings = Settings()
