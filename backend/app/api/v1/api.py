"""
api.py — Agregador de routers de la API v1.

Responsabilidad:
    Combinar todos los routers individuales de `routes/` en un único
    `APIRouter` que se monta en `main.py` con el prefijo `/api/v1`.

Propósito futuro:
    A medida que se vayan implementando los routers, se importan acá
    y se incluyen con `api_router.include_router(...)`.

Dependencias:
    - fastapi.APIRouter
    - app.api.v1.routes.* (todos los routers individuales)

Rol arquitectónico:
    Punto único de registro de endpoints de v1. Si querés agregar un
    nuevo dominio (ej: /metrics), creás `routes/metrics.py` y lo
    incluís acá.
"""

# TODO: from fastapi import APIRouter
# TODO: from app.api.v1.routes import auth, patients, kinesiologos, exercises, routines, progressions, sessions, pose
# TODO: api_router = APIRouter()
# TODO: api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
# TODO: api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
# TODO: api_router.include_router(kinesiologos.router, prefix="/kinesiologos", tags=["Kinesiologos"])
# TODO: api_router.include_router(exercises.router, prefix="/exercises", tags=["Exercises"])
# TODO: api_router.include_router(routines.router, prefix="/routines", tags=["Routines"])
# TODO: api_router.include_router(progressions.router, prefix="/progressions", tags=["Progressions"])
# TODO: api_router.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
# TODO: api_router.include_router(pose.router, prefix="/pose", tags=["Pose"])
