"""
auth_service.py — Servicio de autenticacion.

Logica de negocio para: registrar pacientes, registrar kines,
loguearse, y obtener el usuario actual desde un token.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
)
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.kinesiologo import KinesiologoProfile
from app.models.user import User
from app.schemas.auth import (
    RegisterKinesiologoRequest,
    RegisterPatientRequest,
)


async def register_patient(
    db: AsyncSession,
    data: RegisterPatientRequest,
) -> User:
    """
    Registra un paciente nuevo.

    1. Verifica que el email no exista
    2. Crea el User con role="paciente" y password hasheado
    3. Devuelve el User creado

    NOTA: el paciente se registra sin kinesiologo asignado.
    El kine lo agrega despues desde su panel con el endpoint
    POST /patients (que hizo Agus).
    """
    # Verificar email unico
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none() is not None:
        raise EmailAlreadyRegisteredError(data.email)

    # Crear el user
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
        role="paciente",
        is_active=True,
    )
    db.add(user)
    await db.flush()  # flush para obtener el id sin commitear

    return user


async def register_kinesiologo(
    db: AsyncSession,
    data: RegisterKinesiologoRequest,
) -> User:
    """
    Registra un kinesiologo nuevo.

    1. Verifica que el email no exista
    2. Crea el User con role="kinesiologo"
    3. Crea el KinesiologoProfile con matricula y credencial
    4. Devuelve el User creado
    """
    # Verificar email unico
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none() is not None:
        raise EmailAlreadyRegisteredError(data.email)

    # Crear el user
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
        role="kinesiologo",
        is_active=True,
    )
    db.add(user)
    await db.flush()

    # Crear el perfil de kinesiologo
    profile = KinesiologoProfile(
        user_id=user.id,
        matricula=data.matricula,
        credencial_url=data.credencial_url,
    )
    db.add(profile)
    await db.flush()

    return user


async def authenticate(
    db: AsyncSession,
    email: str,
    password: str,
) -> tuple[User, str]:
    """
    Autentica un usuario con email y password.

    1. Busca el user por email
    2. Verifica el password contra el hash guardado
    3. Genera un token JWT con el email en "sub"
    4. Devuelve (user, token)

    Si el email no existe o el password es incorrecto,
    lanza InvalidCredentialsError (no dice CUAL esta mal
    por seguridad — no le decimos al atacante si el email existe).
    """
    # Buscar usuario
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None:
        raise InvalidCredentialsError()

    # Verificar password
    if not verify_password(password, user.password_hash):
        raise InvalidCredentialsError()

    # Generar token
    token = create_access_token({"sub": user.email, "role": user.role})

    return user, token
