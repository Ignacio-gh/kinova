from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import (
    get_current_kinesiologo,
    get_current_patient,
    get_db,
    verify_patient_belongs_to_kine,
)
from app.schemas.routine import (
    RoutineCreate,
    RoutineResponse,
    RoutineUpdate,
    TodayRoutineItem,
    WeeklyRoutineResponse,
)
from app.services import routine_service

router = APIRouter()


@router.get("/me/today", response_model=list[TodayRoutineItem])
async def get_today_routine(
    patient=Depends(get_current_patient),
    db: AsyncSession = Depends(get_db),
):
    return await routine_service.get_today_routine(db, patient)


@router.get("/me/week", response_model=WeeklyRoutineResponse)
async def get_my_weekly_routine(
    patient=Depends(get_current_patient),
    db: AsyncSession = Depends(get_db),
):
    return await routine_service.get_weekly_routine(db, patient.id)


@router.get("/patient/{patient_id}", response_model=WeeklyRoutineResponse)
async def get_patient_weekly_routine(
    patient=Depends(verify_patient_belongs_to_kine),
    db: AsyncSession = Depends(get_db),
):
    return await routine_service.get_weekly_routine(db, patient.id)


@router.post("/", response_model=RoutineResponse, status_code=201)
async def assign_exercise(
    data: RoutineCreate,
    kine=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    return await routine_service.assign_exercise(db, kine, data)


@router.put("/{routine_id}", response_model=RoutineResponse)
async def update_routine(
    routine_id: int,
    data: RoutineUpdate,
    kine=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    return await routine_service.update_routine(db, routine_id, data, kine)


@router.delete("/{routine_id}", status_code=204)
async def delete_routine(
    routine_id: int,
    kine=Depends(get_current_kinesiologo),
    db: AsyncSession = Depends(get_db),
):
    await routine_service.delete_routine(db, routine_id, kine)
