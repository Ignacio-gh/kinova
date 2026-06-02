from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.schemas.exercise import ExerciseResponse
from app.services import exercise_service

router = APIRouter()


@router.get("/", response_model=list[ExerciseResponse])
async def list_exercises(
    zone: str | None = Query(None),
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    return await exercise_service.list_exercises(db, zone, search)


@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(
    exercise_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    return await exercise_service.get_exercise(db, exercise_id)
