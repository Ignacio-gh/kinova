"""
env.py — Contexto de Alembic para migraciones async.

Lee DATABASE_URL desde el .env via app.config.settings y detecta
automáticamente cambios en los modelos via Base.metadata.
"""

import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Importamos settings para leer DATABASE_URL del .env
from app.config.settings import settings

# Importamos Base + todos los modelos para que Alembic los detecte
from app.db.base import Base  # noqa: F401

config = context.config

# Configurar logging desde alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata de todos los modelos — Alembic la usa para detectar cambios
target_metadata = Base.metadata

# Sobrescribir la URL hardcodeada en alembic.ini con la del .env
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)


def run_migrations_offline() -> None:
    """Modo offline: genera SQL sin conectarse a la DB."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Modo online con motor asíncrono (asyncpg / aiosqlite)."""
    url = settings.DATABASE_URL
    # statement_cache_size=0 es obligatorio con Supabase Supavisor (Transaction mode).
    # ssl="require" es necesario para cualquier conexión PostgreSQL remota.
    connect_args = (
        {"ssl": "require", "statement_cache_size": 0}
        if url.startswith("postgresql")
        else {}
    )
    from sqlalchemy.ext.asyncio import create_async_engine

    connectable = create_async_engine(
        url,
        poolclass=pool.NullPool,
        connect_args=connect_args,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
