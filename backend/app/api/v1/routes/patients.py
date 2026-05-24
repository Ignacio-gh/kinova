"""
patients.py — Endpoints de gestión de pacientes.

Responsabilidad:
    - Lado kinesiólogo: CRUD de SUS pacientes
    - Lado paciente: acceso a su propio dashboard

Endpoints planeados:
    GET    /patients/                    — Lista pacientes del kine actual (filtros)
    POST   /patients/                    — Crear paciente (lo crea el kine)
    GET    /patients/{id}                — Detalle de un paciente
    PUT    /patients/{id}                — Editar datos del paciente
    PATCH  /patients/{id}/status         — Cambiar estado (activo/finalizado)
    GET    /patients/me/dashboard        — Dashboard del paciente logueado

Dependencias:
    - app.schemas.patient
    - app.services.patient_service
    - app.services.adherence_service
    - app.core.dependencies (get_current_kinesiologo, verify_patient_belongs_to_kine)

Reglas de autorización:
    - El kine solo puede ver/editar SUS pacientes (verify_patient_belongs_to_kine)
    - El paciente solo puede ver SU propio dashboard
"""

# TODO: from fastapi import APIRouter, Depends, Query
# TODO: router = APIRouter()
# TODO: GET / con filtros (status, search) → patient_service.list_for_kinesiologo
# TODO: POST / → patient_service.create_patient
# TODO: GET /{id} con verify_patient_belongs_to_kine
# TODO: PUT /{id}
# TODO: PATCH /{id}/status
# TODO: GET /me/dashboard → datos para el home del paciente
