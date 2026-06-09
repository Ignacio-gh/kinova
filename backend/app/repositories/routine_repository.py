"""
routine_repository.py — Acceso a datos de Routines.

Las queries más frecuentes son por (patient_id, day_of_week) desde el
pose engine al inicio de cada sesión — cubiertas por el índice compuesto
ix_routines_patient_day.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.routine import Routine
from app.repositories.base import BaseRepository


class RoutineRepository(BaseRepository[Routine]):
    model = Routine

    async def get_by_id(self, db: AsyncSession, routine_id: int) -> Routine | None:
        result = await db.execute(
            select(Routine)
            .where(Routine.id == routine_id)
            .options(selectinload(Routine.exercise))
        )
        return result.scalar_one_or_none()

    async def list_for_patient(
        self, db: AsyncSession, patient_id: int, active_only: bool = True
    ) -> list[Routine]:
        query = select(Routine).where(Routine.patient_id == patient_id)
        if active_only:
            query = query.where(Routine.is_active.is_(True))
        result = await db.execute(
            query
            .options(selectinload(Routine.exercise))
            .order_by(Routine.day_of_week)
        )
        return list(result.scalars().all())

    async def list_for_patient_by_day(
        self, db: AsyncSession, patient_id: int, day_of_week: str
    ) -> list[Routine]:
        # Usa ix_routines_patient_day (patient_id, day_of_week, is_active)
        result = await db.execute(
            select(Routine)
            .where(
                Routine.patient_id == patient_id,
                Routine.day_of_week == day_of_week,
                Routine.is_active.is_(True),
            )
            .options(selectinload(Routine.exercise))
        )
        return list(result.scalars().all())

    async def exists_for_patient_day(
        self, db: AsyncSession, patient_id: int, exercise_id: int, day: str
    ) -> bool:
        result = await db.execute(
            select(Routine.id).where(
                Routine.patient_id == patient_id,
                Routine.exercise_id == exercise_id,
                Routine.day_of_week == day,
                Routine.is_active.is_(True),
            )
        )
        return result.scalar_one_or_none() is not None

    async def create(self, db: AsyncSession, **data) -> Routine:
        return await super().create(db, **data)

    async def soft_delete(self, db: AsyncSession, routine_id: int) -> None:
        await super().update(db, routine_id, is_active=False)

    async def belongs_to_kine(
        self, db: AsyncSession, routine_id: int, kine_id: int
    ) -> bool:
        result = await db.execute(
            select(Routine.id).where(
                Routine.id == routine_id,
                Routine.assigned_by_kinesiologo_id == kine_id,
            )
        )
        return result.scalar_one_or_none() is not None
