"""
user.py — Schemas de usuario.

Schemas planeados:
    UserBase       — Campos comunes (email, full_name)
    UserResponse   — Output básico de un usuario (sin password_hash)

Uso:
    Lo embeben otros schemas como LoginResponse, PatientResponse, etc.
"""

# TODO: from pydantic import BaseModel, EmailStr
# TODO: class UserBase(BaseModel): email, full_name
# TODO: class UserResponse(UserBase): id, role, is_active, created_at
