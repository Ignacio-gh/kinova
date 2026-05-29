from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.progression import (
    BulkProgressionsUpdate,
    ProgressionCreate,
    ProgressionResponse,
    ProgressionUpdate,
    RoutineProgressionsList,
)


def calculate_current_week(treatment_start_date: date) -> int:
    delta = date.today() - treatment_start_date
    return delta.days // 7 + 1


async def get_effective_angles(
    db: AsyncSession,
    patient,
    routine,
) -> tuple[float | None, float | None]:
    """
    Devuelve los ángulos efectivos para hoy según la progresión del paciente.
    Busca la progresión de la semana actual; si no existe, usa la última
    definida anterior; si no hay ninguna, usa los defaults de la rutina.
    """
    # TODO (modelos Agus): from app.models.progression import RoutineProgression
    from app.models.progression import RoutineProgression

    current_week = calculate_current_week(patient.treatment_start_date)

    result = await db.execute(
        select(RoutineProgression)
        .where(RoutineProgression.routine_id == routine.id)
        .where(RoutineProgression.week_number <= current_week)
        .order_by(RoutineProgression.week_number.desc())
    )
    progression = result.scalars().first()

    if progression is None:
        return routine.default_angle_min, routine.default_angle_max

    return progression.angle_min, progression.angle_max


async def list_progressions(
    db: AsyncSession,
    routine_id: int,
    kine,
) -> RoutineProgressionsList:
    # TODO (modelos Agus): from app.models.progression import RoutineProgression
    from app.models.progression import RoutineProgression
    from app.models.routine import Routine

    result = await db.execute(
        select(Routine).where(
            Routine.id == routine_id,
            Routine.is_active == True,
        )
    )
    routine = result.scalar_one_or_none()

    if routine is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    result = await db.execute(
        select(RoutineProgression)
        .where(RoutineProgression.routine_id == routine_id)
        .order_by(RoutineProgression.week_number)
    )
    progressions = result.scalars().all()

    return RoutineProgressionsList(
        routine_id=routine_id,
        progressions=[ProgressionResponse.model_validate(p) for p in progressions],
    )


async def create_progression(
    db: AsyncSession,
    routine_id: int,
    data: ProgressionCreate,
    kine,
) -> ProgressionResponse:
    # TODO (modelos Agus): from app.models.progression import RoutineProgression
    from app.models.progression import RoutineProgression

    existing = await db.execute(
        select(RoutineProgression).where(
            RoutineProgression.routine_id == routine_id,
            RoutineProgression.week_number == data.week_number,
        )
    )
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe una progresión para la semana {data.week_number}",
        )

    progression = RoutineProgression(
        routine_id=routine_id,
        **data.model_dump(),
    )
    db.add(progression)
    await db.commit()
    await db.refresh(progression)
    return ProgressionResponse.model_validate(progression)


async def update_progression(
    db: AsyncSession,
    progression_id: int,
    data: ProgressionUpdate,
    kine,
) -> ProgressionResponse:
    # TODO (modelos Agus): from app.models.progression import RoutineProgression
    from app.models.progression import RoutineProgression

    result = await db.execute(
        select(RoutineProgression).where(RoutineProgression.id == progression_id)
    )
    progression = result.scalar_one_or_none()

    if progression is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progresión no encontrada")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(progression, field, value)

    await db.commit()
    await db.refresh(progression)
    return ProgressionResponse.model_validate(progression)


async def delete_progression(
    db: AsyncSession,
    progression_id: int,
    kine,
) -> None:
    # TODO (modelos Agus): from app.models.progression import RoutineProgression
    from app.models.progression import RoutineProgression

    result = await db.execute(
        select(RoutineProgression).where(RoutineProgression.id == progression_id)
    )
    progression = result.scalar_one_or_none()

    if progression is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Progresión no encontrada")

    await db.delete(progression)
    await db.commit()


async def bulk_update_progressions(
    db: AsyncSession,
    routine_id: int,
    data: BulkProgressionsUpdate,
    kine,
) -> RoutineProgressionsList:
    """Reemplaza todas las progresiones de una rutina en una sola transacción."""
    # TODO (modelos Agus): from app.models.progression import RoutineProgression
    from app.models.progression import RoutineProgression

    await db.execute(
        delete(RoutineProgression).where(RoutineProgression.routine_id == routine_id)
    )

    new_progressions = [
        RoutineProgression(routine_id=routine_id, **p.model_dump())
        for p in data.progressions
    ]
    db.add_all(new_progressions)
    await db.commit()

    for p in new_progressions:
        await db.refresh(p)

    return RoutineProgressionsList(
        routine_id=routine_id,
        progressions=[ProgressionResponse.model_validate(p) for p in new_progressions],
    )
