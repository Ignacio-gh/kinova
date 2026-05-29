from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.config.settings import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # TODO: inicializar motor de pose (MediaPipe) al arrancar
    yield
    # TODO: cerrar conexiones de DB al apagar


app = FastAPI(
    title="Kinova API",
    version="0.1.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"name": "Kinova API", "version": "0.1.0", "status": "ok"}


@app.get("/health")
async def health():
    return {"status": "ok"}
