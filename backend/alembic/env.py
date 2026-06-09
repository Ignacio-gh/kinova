"""
env.py — Contexto de Alembic (PLACEHOLDER).

Responsabilidad:
    Configurar Alembic para que:
    1. Use DATABASE_URL desde el .env (vía app.config.settings)
    2. Detecte automáticamente cambios en los modelos vía Base.metadata
    3. Soporte motor asíncrono (asyncpg / aiosqlite)

TODO:
    - Importar settings desde app.config.settings
    - Importar Base desde app.db.base (que importa todos los modelos)
    - Sobrescribir sqlalchemy.url con settings.DATABASE_URL
    - Configurar target_metadata = Base.metadata
    - Implementar run_migrations_online() en modo async
"""

# TODO: Implementación pendiente de Agus
