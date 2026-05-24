"""
settings.py — Configuración tipada del backend.

Responsabilidad:
    Leer el archivo `.env` y exponer las variables como un objeto
    tipado, validado por Pydantic.

Clase planeada:
    class Settings(BaseSettings):
        # Database
        DATABASE_URL: str

        # JWT
        SECRET_KEY: str
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

        # CORS
        FRONTEND_URL: str = "http://localhost:5173"

        # Pose
        POSE_CONFIDENCE_THRESHOLD: float = 0.5
        POSE_MODEL_COMPLEXITY: int = 1

        # Environment
        ENVIRONMENT: str = "development"
        DEBUG: bool = True

        model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    settings = Settings()  # instancia global

Dependencias:
    - pydantic-settings

Rol arquitectónico:
    Punto único de configuración. Nada de hardcoding ni de leer
    `os.environ` esparcido por el código.
"""

# TODO: from pydantic_settings import BaseSettings, SettingsConfigDict
# TODO: class Settings(BaseSettings)
# TODO: settings = Settings()
