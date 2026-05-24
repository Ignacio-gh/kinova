"""
session.py — Engine de SQLAlchemy y session factory.

Responsabilidad:
    Crear el engine asíncrono (a partir de DATABASE_URL) y un factory
    de sesiones que se usa para hacer queries.

Componentes planeados:
    engine = create_async_engine(DATABASE_URL, echo=DEBUG)
    AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

    async def get_db() -> AsyncGenerator[AsyncSession, None]:
        async with AsyncSessionLocal() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

Dependencias:
    - sqlalchemy.ext.asyncio (create_async_engine, async_sessionmaker)
    - app.config.settings (DATABASE_URL, DEBUG)

Rol arquitectónico:
    Punto único de conexión a la DB. Todas las sesiones nacen de acá.
"""

# TODO: from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
# TODO: from app.config.settings import settings
# TODO: engine = create_async_engine(...)
# TODO: AsyncSessionLocal = async_sessionmaker(...)
# TODO: async def get_db()
