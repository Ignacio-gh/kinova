"""
main.py — Entry point de la aplicacion FastAPI.

QUE HACE ESTE ARCHIVO:
    Es el archivo que arranca TODO el servidor. Cuando corres:
        uvicorn app.main:app --reload
    Python ejecuta este archivo, crea la app de FastAPI, le conecta
    los middlewares, los routers, y queda escuchando requests.

    Pensalo como el "arranque del auto": conecta el motor (DB),
    prende las luces (logging), pone el espejo (CORS), y sale
    a la ruta (escucha requests).

QUE ES LIFESPAN:
    Es el ciclo de vida de la aplicacion: que hacer al ARRANCAR
    (startup) y que hacer al APAGAR (shutdown).
    - Startup: inicializar el detector de pose (tarda ~1seg)
    - Shutdown: cerrar conexiones a la DB limpiamente

QUE ES @app.get("/"):
    Un endpoint basico que devuelve info de la API. Sirve para
    verificar rapidamente que el servidor esta andando.
    Si vas a http://localhost:8000/ y ves el JSON, funciona.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config.settings import settings
from app.middlewares import (
    setup_cors,
    setup_exception_handlers,
    setup_logging_middleware,
)


# ── LOGGING ───────────────────────────────────────────────────
# Configuramos el logger de Python para que muestre mensajes en
# la consola. El level depende de DEBUG: si es True, muestra TODO
# (incluyendo mensajes de debug). Si es False, solo INFO para arriba.
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("kinova")


# ── LIFESPAN (arranque y apagado) ─────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Se ejecuta al arrancar y al apagar el servidor.

    Antes del yield = STARTUP (arranque):
        - Loggeamos que el server arranco
        - Inicializamos el detector de pose (carga el modelo de IA)
        - Cualquier otra cosa que se necesite al arrancar

    Despues del yield = SHUTDOWN (apagado):
        - Cerramos conexiones a la DB
        - Liberamos recursos
        - Loggeamos que el server se apago
    """
    # ── STARTUP ──
    logger.info("Kinova Backend arrancando...")
    logger.info("Entorno: %s | Debug: %s", settings.ENVIRONMENT, settings.DEBUG)
    logger.info("Frontend URL: %s", settings.FRONTEND_URL)
    logger.info("DB: %s", settings.DATABASE_URL)

    # Pre-inicializar el detector de pose (singleton)
    # Lo importamos aca para que cargue el modelo UNA vez al arrancar,
    # no la primera vez que un paciente abre la camara.
    from app.pose.detector import PoseDetector
    PoseDetector()
    logger.info("MediaPipe Pose inicializado")

    logger.info("Servidor listo!")

    yield  # ← el servidor corre entre el startup y el shutdown

    # ── SHUTDOWN ──
    logger.info("Kinova Backend apagandose...")

    # Cerrar el engine de la DB limpiamente
    from app.db.session import engine
    await engine.dispose()
    logger.info("Conexiones a DB cerradas. Chau!")


# ── CREAR LA APP ──────────────────────────────────────────────
app = FastAPI(
    title="Kinova API",
    description="Backend de asistencia biomecánica para rehabilitación de rodilla",
    version="0.1.0",
    lifespan=lifespan,
    # En produccion no queremos que cualquiera vea la documentacion
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)


# ── REGISTRAR MIDDLEWARES ─────────────────────────────────────
# El orden importa: se ejecutan de abajo para arriba.
# Logging se registra ultimo → se ejecuta primero (envuelve todo).
setup_exception_handlers(app)
setup_cors(app)
setup_logging_middleware(app)


# ── REGISTRAR ROUTERS ─────────────────────────────────────────
# Los routers todavia son placeholders. Cuando se implementen,
# se descomenta esta seccion.
#
# from app.api.v1.api import api_router
# app.include_router(api_router, prefix="/api/v1")


# ── ENDPOINTS BASICOS ─────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    """
    Endpoint raiz. Devuelve info basica de la API.
    Sirve para verificar que el servidor esta corriendo.

    Probalo en el browser: http://localhost:8000/
    """
    return {
        "app": "Kinova API",
        "version": "0.1.0",
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs" if settings.DEBUG else "disabled",
    }


@app.get("/health", tags=["Health"])
async def health():
    """
    Healthcheck. Devuelve "ok" si el servidor esta vivo.
    Lo usan herramientas de monitoreo (Docker, Railway, etc)
    para saber si el server esta andando.
    """
    return {"status": "ok"}
