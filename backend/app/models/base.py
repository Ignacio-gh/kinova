"""
base.py — Clase base declarativa de SQLAlchemy.

Responsabilidad:
    Definir la `Base` de la que heredan todos los modelos ORM.

Dependencias:
    - sqlalchemy.orm.DeclarativeBase

Rol arquitectónico:
    Punto de registro de metadata de SQLAlchemy. Alembic la usa para
    autogenerar migraciones.

Nota:
    También podría centralizar mixins comunes como TimestampMixin
    (created_at, updated_at automáticos).
"""

# TODO: from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
# TODO: from sqlalchemy import DateTime, func
# TODO: from datetime import datetime
# TODO: class Base(DeclarativeBase): pass
# TODO: class TimestampMixin: created_at, updated_at
