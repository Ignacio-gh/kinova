"""
auth.py — Endpoints de autenticacion.

POST /auth/register/patient      — Registro de paciente
POST /auth/register/kinesiologo  — Registro de kinesiologo
POST /auth/login                 — Login (devuelve JWT + role)
GET  /auth/me                    — Datos del usuario logueado
"""

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginResponse,
    RegisterKinesiologoRequest,
    RegisterPatientRequest,
)
from app.schemas.user import KineProfileInfo, MeResponse, UserResponse
from app.services import auth_service

router = APIRouter()


@router.post(
    "/register/patient",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_patient(
    data: RegisterPatientRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Registra un paciente nuevo.

    El paciente se crea sin kinesiologo asignado. El kine
    lo agrega despues desde su panel.
    """
    user = await auth_service.register_patient(db, data)
    return user


@router.post(
    "/register/kinesiologo",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_kinesiologo(
    data: RegisterKinesiologoRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Registra un kinesiologo nuevo.

    Crea User + KinesiologoProfile con matricula y credencial.
    """
    user = await auth_service.register_kinesiologo(db, data)
    return user


@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """
    Login con email y password. Devuelve un JWT.

    Usa OAuth2PasswordRequestForm que es el estandar de FastAPI:
    el frontend manda los datos como form-data con campos
    "username" (que es el email) y "password".

    Esto hace que el boton "Authorize" de /docs funcione
    automaticamente para probar endpoints protegidos.
    """
    user, token = await auth_service.authenticate(
        db, form_data.username, form_data.password
    )
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=MeResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Devuelve datos del usuario logueado + perfil según su rol."""
    from sqlalchemy import select
    from app.models.kinesiologo import KinesiologoProfile

    kine_profile = None
    if current_user.role == "kinesiologo":
        result = await db.execute(
            select(KinesiologoProfile).where(KinesiologoProfile.user_id == current_user.id)
        )
        profile = result.scalar_one_or_none()
        if profile:
            kine_profile = KineProfileInfo.model_validate(profile)

    return MeResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        kinesiologo_profile=kine_profile,
    )
