"""
base.py — Clase base genérica para repositorios.

Responsabilidad:
    Implementar las operaciones CRUD comunes (get, list, create, update,
    delete) parametrizadas por modelo. Los repositorios específicos
    heredan de acá y agregan queries propias.

Clase planeada:
    class BaseRepository[ModelType]:
        model: type[ModelType]

        async def get(db, id) -> ModelType | None
        async def list(db, filters, pagination) -> list[ModelType]
        async def create(db, **data) -> ModelType
        async def update(db, id, **data) -> ModelType
        async def delete(db, id) -> None
        async def count(db, filters) -> int

Dependencias:
    - sqlalchemy.ext.asyncio (AsyncSession)
    - typing (Generic, TypeVar)

Rol arquitectónico:
    Evita repetir el mismo CRUD en cada repositorio específico.
"""

# TODO: from typing import Generic, TypeVar
# TODO: from sqlalchemy.ext.asyncio import AsyncSession
# TODO: ModelType = TypeVar("ModelType")
# TODO: class BaseRepository(Generic[ModelType])
