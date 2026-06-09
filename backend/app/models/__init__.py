"""
app/models/ — Modelos ORM de SQLAlchemy.

Importamos todos los modelos aca para que SQLAlchemy resuelva
las relaciones entre tablas correctamente. Si no se importan
todos juntos, las relaciones (relationship) no encuentran
las clases referenciadas.
"""

from app.models.base import Base, TimestampMixin
from app.models.user import User
from app.models.kinesiologo import KinesiologoProfile
from app.models.patient import PatientProfile

__all__ = [
    "Base",
    "TimestampMixin",
    "User",
    "KinesiologoProfile",
    "PatientProfile",
]
