"""
auth.py — Endpoints de autenticación.

Responsabilidad:
    Exponer los endpoints públicos de registro y login.
    Delegar toda la lógica al `auth_service`.

Endpoints planeados:
    POST   /auth/register/patient        — Registro de paciente
    POST   /auth/register/kinesiologo    — Registro de kinesiólogo (con credencial)
    POST   /auth/login                   — Login (devuelve JWT + role)
    GET    /auth/me                      — Datos del usuario autenticado

Dependencias:
    - app.schemas.auth (LoginRequest, RegisterPatientRequest, ...)
    - app.services.auth_service
    - app.core.dependencies (get_current_user)

Rol arquitectónico:
    Capa de presentación. Sin lógica de negocio.
"""

# TODO: from fastapi import APIRouter, Depends, status
# TODO: router = APIRouter()
# TODO: POST /register/patient → llama a auth_service.register_patient
# TODO: POST /register/kinesiologo → llama a auth_service.register_kinesiologo
# TODO: POST /login → llama a auth_service.authenticate
# TODO: GET /me → usa Depends(get_current_user) y devuelve el usuario
