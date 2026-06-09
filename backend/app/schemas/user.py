"""
user.py — Schemas de usuario.

Define los schemas basicos de usuario que otros schemas reusan.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Campos comunes a todos los schemas de usuario."""
    email: EmailStr
    full_name: str


class UserResponse(UserBase):
    """
    Lo que devuelve la API cuando te pide datos de un usuario.
    NUNCA incluye password_hash.
    """
    id: int
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
