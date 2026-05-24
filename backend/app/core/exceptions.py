"""
exceptions.py — Excepciones custom del dominio.

Responsabilidad:
    Definir excepciones específicas del dominio para devolver respuestas
    HTTP claras y consistentes.

Excepciones planeadas:
    DomainError(Exception)                  — Base de todas las excepciones del dominio

    # Auth
    InvalidCredentialsError                 — 401
    EmailAlreadyRegisteredError             — 400
    UnauthorizedError                       — 403

    # Patients
    PatientNotFoundError                    — 404
    PatientNotBelongsToKinesiologoError     — 403

    # Routines & Progressions
    RoutineNotFoundError                    — 404
    InvalidDayOfWeekError                   — 400
    InvalidProgressionWeekError             — 400
    DuplicateProgressionError               — 400

    # Sessions
    SessionNotFoundError                    — 404
    SessionAlreadyEndedError                — 400

    # Pose
    InvalidFrameError                       — 400
    PoseDetectionError                      — 500

Manejo:
    Estas excepciones son atrapadas por el middleware `error_handler`
    en `app.middlewares.error_handler`, que las traduce a respuestas HTTP.
"""

# TODO: class DomainError(Exception): pass
# TODO: class InvalidCredentialsError(DomainError): pass
# TODO: class EmailAlreadyRegisteredError(DomainError): pass
# TODO: class UnauthorizedError(DomainError): pass
# TODO: class PatientNotFoundError(DomainError): pass
# TODO: class PatientNotBelongsToKinesiologoError(DomainError): pass
# TODO: class RoutineNotFoundError(DomainError): pass
# TODO: class InvalidDayOfWeekError(DomainError): pass
# TODO: class InvalidProgressionWeekError(DomainError): pass
# TODO: class DuplicateProgressionError(DomainError): pass
# TODO: class SessionNotFoundError(DomainError): pass
# TODO: class SessionAlreadyEndedError(DomainError): pass
# TODO: class InvalidFrameError(DomainError): pass
# TODO: class PoseDetectionError(DomainError): pass
