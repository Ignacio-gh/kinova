"""
dependencies.py — Dependencias inyectables de FastAPI.

QUE HACE ESTE ARCHIVO:
    Define funciones que FastAPI ejecuta AUTOMATICAMENTE antes de cada
    endpoint para resolver cosas comunes: "¿quien es el usuario?",
    "¿tiene permiso?", "¿es paciente o kinesiologo?".

QUE ES "INYECCION DE DEPENDENCIAS":
    Imaginate que cada endpoint es un empleado, y necesita cosas para
    trabajar: la sesion de DB, el usuario actual, verificar permisos.

    Sin inyeccion de dependencias, cada endpoint tendria que hacer
    TODO eso a mano:
        @router.get("/mis-rutinas")
        async def mis_rutinas(request: Request):
            token = request.headers["Authorization"].split(" ")[1]  # sacar token
            payload = decode_access_token(token)                    # decodificar
            if payload is None: raise HTTPException(401)            # verificar
            user = await db.get(User, payload["sub"])               # buscar user
            if user.role != "paciente": raise HTTPException(403)    # verificar rol
            # ... y recien aca empieza la logica real

    Con inyeccion de dependencias:
        @router.get("/mis-rutinas")
        async def mis_rutinas(patient = Depends(get_current_patient)):
            # 'patient' ya es el paciente verificado, listo para usar
            # toda esa logica de arriba la hizo FastAPI por vos

    FastAPI ve el Depends(), ejecuta la funcion, y le pasa el resultado
    al endpoint. Si algo falla (token invalido, no es paciente), el
    endpoint NI SE EJECUTA — FastAPI devuelve el error automaticamente.

COMO SE ENCADENAN (esto es lo mas copado):
    get_db() → provee la sesion de DB
        ↓
    get_current_user(token, db) → decodifica JWT, busca usuario en DB
        ↓
    get_current_patient(user) → verifica que sea paciente
        ↓
    verify_patient_belongs_to_kine(patient_id, kine, db) → verifica propiedad

    Cada funcion depende de la anterior. FastAPI resuelve toda la cadena
    automaticamente. Es como un arbol: si una rama falla, las hojas
    ni se ejecutan.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.session import get_db


# ── OAUTH2 SCHEME ─────────────────────────────────────────────
# Esto le dice a FastAPI: "los tokens vienen en el header
# Authorization: Bearer <token> y el endpoint de login esta en
# /api/v1/auth/login".
#
# ¿Para que sirve? Dos cosas:
# 1. Extrae el token del header automaticamente
# 2. En la documentacion interactiva (/docs) agrega el boton de
#    "Authorize" donde podes pegar tu token para probar endpoints
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


# ── GET CURRENT USER ──────────────────────────────────────────
# Esta es LA funcion clave. Cada endpoint protegido la usa.
# Recibe el token, lo decodifica, busca al usuario en la DB,
# y lo devuelve. Si algo falla, tira 401.
#
# NOTA: importamos User aca adentro (no arriba) para evitar
# imports circulares. Esto es un patron comun en Python: si dos
# modulos se importan entre si, Python se confunde. Importar
# dentro de la funcion lo evita.
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Decodifica el JWT y devuelve el User de la DB.

    ¿Que puede salir mal?
    - Token invalido/expirado → 401
    - Token no tiene "sub" (email) → 401
    - El email del token no existe en la DB → 401
      (ej: usuario borrado pero el token aun no expiro)
    """
    # 1. Decodificar el token
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            # Este header le dice al frontend "necesitas autenticarte"
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Sacar el email del payload
    email: str | None = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token sin identificador de usuario",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Buscar al usuario en la DB
    # Import local para evitar import circular
    from app.models.user import User

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


# ── GET CURRENT PATIENT ───────────────────────────────────────
# Usa get_current_user y encima verifica que sea paciente.
# Si un kinesiologo intenta acceder a un endpoint de pacientes,
# esta funcion lo frena.
async def get_current_patient(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Verifica que el usuario logueado sea un paciente
    y devuelve su perfil de paciente (PatientProfile).
    """
    if current_user.role != "paciente":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este endpoint es solo para pacientes",
        )

    from app.models.patient import PatientProfile

    result = await db.execute(
        select(PatientProfile).where(PatientProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil de paciente no encontrado",
        )

    return profile


# ── GET CURRENT KINESIOLOGO ───────────────────────────────────
# Igual que el anterior pero para kines.
async def get_current_kinesiologo(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Verifica que el usuario logueado sea un kinesiologo
    y devuelve su perfil (KinesiologoProfile).
    """
    if current_user.role != "kinesiologo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este endpoint es solo para kinesiólogos",
        )

    from app.models.kinesiologo import KinesiologoProfile

    result = await db.execute(
        select(KinesiologoProfile).where(
            KinesiologoProfile.user_id == current_user.id
        )
    )
    profile = result.scalar_one_or_none()

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil de kinesiólogo no encontrado",
        )

    return profile


# ── VERIFY PATIENT BELONGS TO KINE ────────────────────────────
# Verifica que un kinesiologo solo pueda acceder a SUS pacientes.
# Sin esto, un kine podria ver los pacientes de otro kine
# simplemente cambiando el ID en la URL.
async def verify_patient_belongs_to_kine(
    patient_id: int,
    kine_profile=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    """
    Verifica que el paciente con patient_id pertenezca al
    kinesiologo logueado. Si no, tira 403.

    Se usa en endpoints como:
        GET /patients/{patient_id}/routines
        POST /patients/{patient_id}/routines
    """
    from app.models.patient import PatientProfile

    result = await db.execute(
        select(PatientProfile).where(PatientProfile.id == patient_id)
    )
    patient = result.scalar_one_or_none()

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Paciente con ID {patient_id} no encontrado",
        )

    if patient.kinesiologo_id != kine_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este paciente no pertenece a tu lista de pacientes",
        )

    return patient
