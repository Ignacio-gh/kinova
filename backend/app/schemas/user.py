"""
user.py — Schemas de usuario.

QUE ES UN SCHEMA (DTO):
    Un schema define la FORMA de los datos que viajan entre el frontend
    y el backend. Es como un formulario con campos obligatorios:
    si falta un campo o tiene un tipo incorrecto, Pydantic lo rechaza
    automaticamente ANTES de que llegue a tu codigo.

    Es distinto del MODELO (la tabla en la DB):
    - El MODELO tiene password_hash (dato interno, nunca se muestra)
    - El SCHEMA de respuesta tiene id, email, nombre (lo que el front necesita)
    - El SCHEMA de creacion tiene password en texto plano (lo que el user escribe)

    Pensalo asi:
    - Modelo = lo que esta guardado en el cajón (DB)
    - Schema = lo que le mostras al cliente (API)

QUE HACE ESTE ARCHIVO:
    Define los schemas basicos de usuario que otros schemas reusan.
    Por ejemplo, LoginResponse incluye un UserResponse adentro.

POR QUE UserBase EXISTE:
    Para no repetir los campos comunes (email, full_name) en cada
    schema. UserResponse hereda de UserBase y le agrega campos.
    Si mañana agregas un campo "phone", lo pones en UserBase y
    automaticamente aparece en todos los schemas que heredan.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """
    Campos comunes a todos los schemas de usuario.
    Otros schemas heredan de este para no repetir.
    """
    email: EmailStr        # Pydantic valida formato de email automaticamente
    full_name: str


class UserResponse(UserBase):
    """
    Lo que devuelve la API cuando te pide datos de un usuario.
    NUNCA incluye password_hash — eso es interno.

    Ejemplo de JSON que recibe el frontend:
    {
        "id": 1,
        "email": "santi@kinova.com",
        "full_name": "Santiago Garcia",
        "role": "kinesiologo",
        "is_active": true,
        "created_at": "2025-05-24T10:30:00"
    }
    """
    id: int
    role: str              # "paciente" o "kinesiologo"
    is_active: bool
    created_at: datetime

    # model_config le dice a Pydantic que puede leer datos desde
    # un objeto ORM (el modelo de SQLAlchemy), no solo desde un dict.
    # Sin esto, Pydantic no sabe leer user.email de un objeto User,
    # solo de un diccionario {"email": "..."}.
    model_config = {"from_attributes": True}
