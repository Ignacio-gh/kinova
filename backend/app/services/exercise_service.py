from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.exercise import ExerciseListItem, ExerciseResponse


async def list_exercises(
    db: AsyncSession,
    zone: str | None = None,
    search: str | None = None,
) -> list[ExerciseResponse]:
    from app.models.exercise import Exercise

    query = select(Exercise)

    if zone:
        query = query.where(Exercise.zone == zone)
    if search:
        query = query.where(Exercise.name.ilike(f"%{search}%"))

    result = await db.execute(query)
    exercises = result.scalars().all()
    return [ExerciseResponse.model_validate(e) for e in exercises]


async def get_exercise(db: AsyncSession, exercise_id: int) -> ExerciseResponse:
    from app.models.exercise import Exercise

    result = await db.execute(select(Exercise).where(Exercise.id == exercise_id))
    exercise = result.scalar_one_or_none()

    if exercise is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ejercicio no encontrado")

    return ExerciseResponse.model_validate(exercise)
