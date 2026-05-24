"""
auth_service.py — Servicio de autenticación.

Responsabilidad:
    Implementar los casos de uso de auth: registro, login, decodificación
    de JWT, recuperar usuario actual.

Funciones planeadas:
    async def register_patient(data: RegisterPatientRequest) -> User
        - Valida email único
        - Hashea password
        - Crea User + PatientProfile en transacción
        - Devuelve el User

    async def register_kinesiologo(data: RegisterKinesiologoRequest) -> User
        - Idem pero con KinesiologoProfile y credencial

    async def authenticate(email: str, password: str) -> tuple[User, str]
        - Busca user por email
        - Verifica password con bcrypt
        - Genera JWT con role embebido
        - Devuelve (user, token)

    async def get_user_from_token(token: str) -> User
        - Decodifica JWT
        - Busca user en DB
        - Devuelve el User o lanza UnauthorizedError

Dependencias:
    - app.core.security (hash_password, verify_password, create_access_token)
    - app.repositories.user_repository
    - app.core.exceptions
"""

# TODO: async def register_patient(db, data)
# TODO: async def register_kinesiologo(db, data)
# TODO: async def authenticate(db, email, password)
# TODO: async def get_user_from_token(db, token)
