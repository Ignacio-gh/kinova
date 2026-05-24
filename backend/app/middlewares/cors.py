"""
cors.py — Configuración de CORS.

Responsabilidad:
    Permitir que el frontend (en localhost:5173 en dev) pueda hacer
    requests al backend (en localhost:8000).

Función planeada:
    def setup_cors(app: FastAPI) -> None:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[settings.FRONTEND_URL],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

Dependencias:
    - fastapi.middleware.cors
    - app.config.settings (FRONTEND_URL)
"""

# TODO: from fastapi import FastAPI
# TODO: from fastapi.middleware.cors import CORSMiddleware
# TODO: from app.config.settings import settings
# TODO: def setup_cors(app)
