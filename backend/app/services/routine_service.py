from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.exercise import ExerciseResponse
from app.schemas.routine import (
    RoutineCreate,
    RoutineResponse,
    RoutineUpdate,
    TodayRoutineItem,
    WeeklyRoutineResponse,
)

DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


def _day_of_week() -> str:
    return DAYS[date.today().weekday()]


async def assign_exercise(
    db: AsyncSession,
    kine,
    data: RoutineCreate,
) -> RoutineResponse:
    from app.models.routine import Routine
    from app.models.exercise import Exercise

    exercise_result = await db.execute(select(Exercise).where(Exercise.id == data.exercise_id))
    exercise = exercise_result.scalar_one_or_none()
    if exercise is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ejercicio no encontrado")

    duplicate = await db.execute(
        select(Routine).where(
            Routine.patient_id == data.patient_id,
            Routine.exercise_id == data.exercise_id,
            Routine.day_of_week == data.day_of_week,
            Routine.is_active == True,
        )
    )
    if duplicate.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este ejercicio ya está asignado para ese día",
        )

    routine = Routine(
        patient_id=data.patient_id,
        exercise_id=data.exercise_id,
        day_of_week=data.day_of_week,
        reps=data.reps,
        sets=data.sets,
        angle_min=data.angle_min,
        angle_max=data.angle_max,
        is_active=True,
    )
    db.add(routine)
    await db.commit()
    await db.refresh(routine)

    return RoutineResponse(
        id=routine.id,
        patient_id=routine.patient_id,
        exercise=ExerciseResponse.model_validate(exercise),
        day_of_week=routine.day_of_week,
        reps=routine.reps,
        sets=routine.sets,
        angle_min=routine.angle_min,
        angle_max=routine.angle_max,
        is_active=routine.is_active,
    )


async def get_weekly_routine(
    db: AsyncSession,
    patient_id: int,
) -> WeeklyRoutineResponse:
    from app.models.routine import Routine
    from app.models.exercise import Exercise

    result = await db.execute(
        select(Routine, Exercise)
        .join(Exercise, Exercise.id == Routine.exercise_id)
        .where(Routine.patient_id == patient_id, Routine.is_active == True)
        .order_by(Routine.day_of_week)
    )
    rows = result.all()

    weekly: dict[str, list[RoutineResponse]] = {day: [] for day in DAYS}
    for routine, exercise in rows:
        weekly[routine.day_of_week].append(
            RoutineResponse(
                id=routine.id,
                patient_id=routine.patient_id,
                exercise=ExerciseResponse.model_validate(exercise),
                day_of_week=routine.day_of_week,
                reps=routine.reps,
                sets=routine.sets,
                angle_min=routine.angle_min,
                angle_max=routine.angle_max,
                is_active=routine.is_active,
            )
        )

    return WeeklyRoutineResponse(**weekly)


async def get_today_routine(
    db: AsyncSession,
    patient,
) -> list[TodayRoutineItem]:
    from app.models.routine import Routine
    from app.models.exercise import Exercise

    today = _day_of_week()

    result = await db.execute(
        select(Routine, Exercise)
        .join(Exercise, Exercise.id == Routine.exercise_id)
        .where(
            Routine.patient_id == patient.id,
            Routine.day_of_week == today,
            Routine.is_active == True,
        )
    )
    rows = result.all()

    return [
        TodayRoutineItem(
            routine_id=routine.id,
            exercise=ExerciseResponse.model_validate(exercise),
            reps=routine.reps,
            sets=routine.sets,
            angle_min=routine.angle_min,
            angle_max=routine.angle_max,
        )
        for routine, exercise in rows
    ]


async def update_routine(
    db: AsyncSession,
    routine_id: int,
    data: RoutineUpdate,
    kine,
) -> RoutineResponse:
    from app.models.routine import Routine
    from app.models.exercise import Exercise

    result = await db.execute(
        select(Routine, Exercise)
        .join(Exercise, Exercise.id == Routine.exercise_id)
        .where(Routine.id == routine_id, Routine.is_active == True)
    )
    row = result.first()

    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    routine, exercise = row

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(routine, field, value)

    await db.commit()
    await db.refresh(routine)

    return RoutineResponse(
        id=routine.id,
        patient_id=routine.patient_id,
        exercise=ExerciseResponse.model_validate(exercise),
        day_of_week=routine.day_of_week,
        reps=routine.reps,
        sets=routine.sets,
        angle_min=routine.angle_min,
        angle_max=routine.angle_max,
        is_active=routine.is_active,
    )


async def delete_routine(
    db: AsyncSession,
    routine_id: int,
    kine,
) -> None:
    from app.models.routine import Routine

    result = await db.execute(
        select(Routine).where(Routine.id == routine_id, Routine.is_active == True)
    )
    routine = result.scalar_one_or_none()

    if routine is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")

    routine.is_active = False
    await db.commit()
