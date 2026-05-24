"""
dependencies.py — Dependencias inyectables de FastAPI.

Responsabilidad:
    Funciones que FastAPI inyecta automáticamente en los endpoints
    para resolver el usuario actual, validar permisos, abrir sesiones
    de DB, etc.

Dependencias planeadas:
    get_db() -> AsyncSession
        Provee una sesión de DB al endpoint.
        Se cierra automáticamente al terminar el request.

    get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db)) -> User
        Decodifica el JWT, busca al usuario en DB, lo devuelve.

    get_current_patient(user = Depends(get_current_user)) -> PatientProfile
        Asegura que el usuario tenga role "paciente".

    get_current_kinesiologo(user = Depends(get_current_user)) -> KinesiologoProfile
        Asegura que el usuario tenga role "kinesiologo".

    verify_patient_belongs_to_kine(patient_id: int, kine = Depends(get_current_kinesiologo))
        Chequea que el paciente accedido pertenezca al kine logueado.

    verify_routine_belongs_to_kinesiologo(routine_id: int, kine = Depends(get_current_kinesiologo))
        Idem pero para rutinas.

Dependencias:
    - fastapi (Depends, HTTPException)
    - fastapi.security (OAuth2PasswordBearer)
    - app.core.security (decode_access_token)
    - app.db.session (async_session_factory)
    - app.repositories (consulta de User, Patient, Kine, Routine)

Rol arquitectónico:
    Capa de control de acceso declarativa.
    El endpoint declara qué necesita, esta capa lo resuelve.
"""

# TODO: from fastapi import Depends, HTTPException, status
# TODO: from fastapi.security import OAuth2PasswordBearer
# TODO: oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
# TODO: async def get_db() -> AsyncSession
# TODO: async def get_current_user(token, db) -> User
# TODO: async def get_current_patient(user) -> PatientProfile
# TODO: async def get_current_kinesiologo(user) -> KinesiologoProfile
# TODO: async def verify_patient_belongs_to_kine(patient_id, kine, db)
# TODO: async def verify_routine_belongs_to_kinesiologo(routine_id, kine, db)
