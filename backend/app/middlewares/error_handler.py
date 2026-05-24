"""
error_handler.py — Middleware global de manejo de errores.

Responsabilidad:
    Atrapar excepciones custom del dominio (definidas en
    `core/exceptions.py`) y devolverlas como respuestas HTTP
    con status code apropiado y formato consistente.

Mapeo planeado:
    InvalidCredentialsError              → 401
    UnauthorizedError                    → 403
    PatientNotBelongsToKinesiologoError  → 403
    *NotFoundError                       → 404
    EmailAlreadyRegisteredError          → 400
    Invalid*Error                        → 400
    Duplicate*Error                      → 400
    PoseDetectionError                   → 500
    Exception (genérica)                 → 500

Formato de respuesta unificado:
    {
      "error": "PatientNotFoundError",
      "message": "El paciente no existe.",
      "status_code": 404
    }

Dependencias:
    - fastapi (Request, JSONResponse)
    - app.core.exceptions
"""

# TODO: from fastapi import FastAPI, Request
# TODO: from fastapi.responses import JSONResponse
# TODO: from app.core.exceptions import *
# TODO: def setup_exception_handlers(app)
