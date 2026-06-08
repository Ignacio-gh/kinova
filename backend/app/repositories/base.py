"""
base.py — Clase base genérica para repositorios.

Implementa CRUD asíncrono parametrizado por modelo ORM.
Los repositorios específicos heredan de acá y agregan sus propias queries.

Nota sobre flush vs commit:
    Usamos db.flush() (no commit) para que el registro sea visible dentro de
    la misma transacción sin cerrarla. El commit real lo hace get_db() en
    db/session.py cuando el endpoint termina sin errores.
"""

from typing import Generic, TypeVar

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    model: type[ModelType]

    async def get(self, db: AsyncSession, id: int) -> ModelType | None:
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, **data) -> ModelType:
        instance = self.model(**data)
        db.add(instance)
        await db.flush()
        await db.refresh(instance)
        return instance

    async def update(self, db: AsyncSession, id: int, **data) -> ModelType | None:
        instance = await self.get(db, id)
        if instance is None:
            return None
        for key, value in data.items():
            setattr(instance, key, value)
        await db.flush()
        return instance

    async def delete(self, db: AsyncSession, id: int) -> bool:
        instance = await self.get(db, id)
        if instance is None:
            return False
        await db.delete(instance)
        return True

    async def count(self, db: AsyncSession) -> int:
        result = await db.execute(
            select(func.count()).select_from(self.model)
        )
        return result.scalar_one()
