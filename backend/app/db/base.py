"""
base.py — Registro central de todos los modelos.

Importa todos los modelos para que SQLAlchemy y Alembic los vean.
"""

from app.models import Base, User, KinesiologoProfile, PatientProfile  # noqa: F401
