"""
main.py — Entry point de la aplicacion FastAPI.

QUE HACE ESTE ARCHIVO:
    Es el archivo que arranca TODO el servidor. Cuando corres:
        uvicorn app.main:app --reload
    Python ejecuta este archivo, crea la app de FastAPI, le conecta
    los middlewares, los routers, y queda escuchando requests.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.api import api_router
from app.config.settings import settings
from app.middlewares import (
    setup_cors,
    setup_exception_handlers,
    setup_logging_middleware,
)


# ── LOGGING ───────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("kinova")


# ── LIFESPAN (arranque y apagado) ─────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── STARTUP ──
    logger.info("Kinova Backend arrancando...")
    logger.info("Entorno: %s | Debug: %s", settings.ENVIRONMENT, settings.DEBUG)
    logger.info("Frontend URL: %s", settings.FRONTEND_URL)
    logger.info("DB: %s", settings.DATABASE_URL)

    from app.pose.detector import PoseDetector
    PoseDetector()
    logger.info("MediaPipe Pose inicializado")

    logger.info("Servidor listo!")

    yield

    # ── SHUTDOWN ──
    logger.info("Kinova Backend apagandose...")
    from app.db.session import engine
    await engine.dispose()
    logger.info("Conexiones a DB cerradas. Chau!")


# ── CREAR LA APP ──────────────────────────────────────────────
app = FastAPI(
    title="Kinova API",
    description="Backend de asistencia biomecánica para rehabilitación de rodilla",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)


# ── REGISTRAR MIDDLEWARES ─────────────────────────────────────
setup_exception_handlers(app)
setup_cors(app)
setup_logging_middleware(app)


# ── REGISTRAR ROUTERS ─────────────────────────────────────────
app.include_router(api_router, prefix="/api/v1")


# ── ENDPOINTS BASICOS ─────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "app": "Kinova API",
        "version": "0.1.0",
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs" if settings.DEBUG else "disabled",
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}
