"""
security.py — Utilidades de seguridad y autenticación.

Responsabilidad:
    - Hashing y verificación de passwords (bcrypt via passlib)
    - Generación y decodificación de tokens JWT (python-jose)

Funciones planeadas:
    hash_password(plain: str) -> str
    verify_password(plain: str, hashed: str) -> bool
    create_access_token(data: dict, expires_delta: timedelta | None) -> str
    decode_access_token(token: str) -> dict | None

Dependencias:
    - passlib[bcrypt]
    - python-jose[cryptography]
    - app.config.settings (SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES)

Rol arquitectónico:
    Capa de utilidades de seguridad. Es consumida por:
    - auth_service (al registrar/loguear)
    - core/dependencies (al validar el token de cada request)
"""

# TODO: from passlib.context import CryptContext
# TODO: from jose import jwt, JWTError
# TODO: pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# TODO: def hash_password(plain: str) -> str
# TODO: def verify_password(plain: str, hashed: str) -> bool
# TODO: def create_access_token(data: dict, expires_delta=None) -> str
# TODO: def decode_access_token(token: str) -> dict | None
