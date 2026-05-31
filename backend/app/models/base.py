"""
base.py — Clase base de todos los modelos ORM.

Todos los modelos heredan de Base. TimestampMixin agrega
created_at y updated_at automaticos a cualquier tabla.
"""

from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Clase base declarativa de SQLAlchemy. Todos los modelos heredan de esta."""
    pass


class TimestampMixin:
    """
    Mixin que agrega created_at y updated_at a cualquier modelo.

    created_at: se setea automaticamente al crear el registro
    updated_at: se actualiza automaticamente cada vez que se modifica
    """
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
