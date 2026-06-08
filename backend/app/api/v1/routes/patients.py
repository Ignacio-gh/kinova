from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import (
    get_current_kinesiologo,
    get_current_patient,
    get_db,
)
from app.schemas.patient import (
    PatientCreate,
    PatientDashboard,
    PatientListItem,
    PatientResponse,
    PatientSelfProfile,
    PatientStatusUpdate,
    PatientUpdate,
)
from app.services import patient_service

router = APIRouter()


@router.get("/", response_model=list[PatientListItem])
async def list_patients(
    search: str | None = Query(None),
    status: str | None = Query(None, pattern="^(activo|finalizado)$"),
    kine=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    return await patient_service.list_for_kinesiologo(db, kine, search, status)


@router.post("/", response_model=PatientResponse, status_code=201)
async def create_patient(
    data: PatientCreate,
    kine=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    return await patient_service.create_patient(db, kine, data)


@router.get("/me/profile", response_model=PatientSelfProfile)
async def get_my_profile(
    patient=Depends(get_current_patient),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select
    from app.models.user import User
    from app.models.kinesiologo import KinesiologoProfile
    from app.services.patient_service import _current_week

    user_result = await db.execute(select(User).where(User.id == patient.user_id))
    user = user_result.scalar_one_or_none()

    kine_name = None
    if patient.kinesiologo_id:
        kine_result = await db.execute(
            select(User)
            .join(KinesiologoProfile, KinesiologoProfile.user_id == User.id)
            .where(KinesiologoProfile.id == patient.kinesiologo_id)
        )
        kine_user = kine_result.scalar_one_or_none()
        if kine_user:
            kine_name = kine_user.full_name

    return PatientSelfProfile(
        full_name=user.full_name if user else '',
        email=user.email if user else '',
        diagnosis=patient.diagnosis,
        treatment_weeks=patient.treatment_weeks,
        current_week=_current_week(patient.treatment_start_date),
        status=patient.status,
        kinesiologo_name=kine_name,
    )


@router.get("/me/dashboard", response_model=PatientDashboard)
async def get_dashboard(
    patient=Depends(get_current_patient),
    db: AsyncSession = Depends(get_db),
):
    return await patient_service.get_dashboard(db, patient)


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: int,
    kine=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    return await patient_service.get_patient_detail(db, patient_id, kine)


@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: int,
    data: PatientUpdate,
    kine=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    return await patient_service.update_patient(db, patient_id, data, kine)


@router.patch("/{patient_id}/status", response_model=PatientResponse)
async def update_status(
    patient_id: int,
    data: PatientStatusUpdate,
    kine=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    return await patient_service.update_status(db, patient_id, data, kine)
