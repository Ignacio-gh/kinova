"""
sessions.py — Endpoints de sesiones de ejercicio.

Responsabilidad:
    Manejar el ciclo de vida de una sesión: arranque, ejecución de cada
    ejercicio, cierre, y consulta del historial.

Endpoints planeados:
    POST   /sessions/                                — Iniciar una sesión
    POST   /sessions/{id}/exercises                  — Registrar inicio de un ejercicio
    PATCH  /sessions/{id}/exercises/{ex_id}/complete — Cerrar ejecución (reps, score)
    PATCH  /sessions/{id}/end                        — Cerrar la sesión completa
    GET    /sessions/me/history                      — Historial del paciente logueado
    GET    /sessions/patient/{id}/history            — Historial de un paciente (kine)

Dependencias:
    - app.schemas.session
    - app.services.session_service
    - app.services.adherence_service
    - app.core.dependencies

Modelo conceptual:
    Session
    ├── ExerciseExecution 1 (un ejercicio dentro de la sesión)
    │   └── FeedbackLog [...] (correcciones puntuales)
    ├── ExerciseExecution 2
    └── ...
"""

# TODO: from fastapi import APIRouter, Depends
# TODO: router = APIRouter()
# TODO: POST / → crear Session activa para el paciente
# TODO: POST /{id}/exercises → crear ExerciseExecution
# TODO: PATCH /{id}/exercises/{ex_id}/complete → registrar reps y score
# TODO: PATCH /{id}/end → calcular duración y adherencia, cerrar
# TODO: GET /me/history → historial paginado
# TODO: GET /patient/{id}/history → idem pero con verify_patient_belongs_to_kine
