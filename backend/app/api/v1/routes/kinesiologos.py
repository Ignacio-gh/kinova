"""
kinesiologos.py — Endpoints del kinesiólogo.

Responsabilidad:
    Datos propios del kinesiólogo logueado (dashboard, perfil, stats).

Endpoints planeados:
    GET    /kinesiologos/me               — Datos del kine logueado
    GET    /kinesiologos/me/dashboard     — Stats del dashboard (cantidad de pacientes, adherencia promedio, etc.)
    PUT    /kinesiologos/me               — Editar perfil

Dependencias:
    - app.schemas.kinesiologo
    - app.services.kinesiologo_service
    - app.services.adherence_service
    - app.core.dependencies (get_current_kinesiologo)

Rol arquitectónico:
    Endpoints "yo-céntricos" del kine. Para gestionar pacientes ajenos
    se usa `/patients/`.
"""

# TODO: from fastapi import APIRouter, Depends
# TODO: router = APIRouter()
# TODO: GET /me → datos del kine logueado
# TODO: GET /me/dashboard → adherencia promedio de sus pacientes + stats
# TODO: PUT /me → editar perfil del kine
