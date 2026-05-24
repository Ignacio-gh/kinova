"""
auth.py — Schemas de autenticación.

Schemas planeados:
    LoginRequest             — Input del login: { email, password }
    LoginResponse            — Output: { access_token, token_type, role, user }
    RegisterPatientRequest   — Input registro paciente: { full_name, email, password }
    RegisterKinesiologoRequest — Input registro kine: + matricula, credencial
    TokenPayload             — Estructura interna del JWT decodificado

Validaciones planeadas:
    - email: EmailStr (Pydantic valida formato automáticamente)
    - password: min 8 caracteres
    - matricula: regex de formato de matrícula profesional
"""

# TODO: from pydantic import BaseModel, EmailStr, Field
# TODO: class LoginRequest(BaseModel)
# TODO: class LoginResponse(BaseModel)
# TODO: class RegisterPatientRequest(BaseModel)
# TODO: class RegisterKinesiologoRequest(BaseModel)
# TODO: class TokenPayload(BaseModel)
