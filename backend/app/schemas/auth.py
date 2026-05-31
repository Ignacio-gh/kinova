"""
auth.py — Schemas de autenticacion (login, registro).

QUE HACE ESTE ARCHIVO:
    Define la forma exacta de los datos que viajan en los endpoints
    de autenticacion:
    - Que manda el frontend cuando alguien se registra
    - Que manda cuando se loguea
    - Que le devuelve el backend como respuesta

    FastAPI usa estos schemas para:
    1. VALIDAR automaticamente (si falta un campo → 422 error)
    2. DOCUMENTAR automaticamente (aparecen en /docs)
    3. SERIALIZAR (convertir objetos Python → JSON)

EJEMPLO DE USO EN UN ENDPOINT (futuro):
    @router.post("/login", response_model=LoginResponse)
    async def login(data: LoginRequest):
        # 'data' ya esta validado por Pydantic
        # si el email es invalido o falta el password,
        # FastAPI devuelve 422 antes de llegar aca
        token = await auth_service.authenticate(data.email, data.password)
        return token

RELACION CON EL DOC:
    Segun el documento de arquitectura:
    - LoginRequest:              { email, password }
    - LoginResponse:             { access_token, role, user }
    - RegisterPatientRequest:    { full_name, email, password }
    - RegisterKinesiologoRequest: { full_name, email, password, matricula, credencial_url }
"""

from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserResponse


# ── LOGIN ─────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    """
    Lo que manda el frontend cuando el usuario hace click en "Iniciar sesion".

    Ejemplo de JSON que llega:
    {
        "email": "santi@kinova.com",
        "password": "miContraseña123"
    }
    """
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """
    Lo que devuelve el backend si el login fue exitoso.

    Ejemplo de JSON que recibe el frontend:
    {
        "access_token": "eyJhbGciOiJIUzI1NiIs...",
        "token_type": "bearer",
        "role": "kinesiologo",
        "user": {
            "id": 1,
            "email": "santi@kinova.com",
            "full_name": "Santiago Garcia",
            "role": "kinesiologo",
            "is_active": true,
            "created_at": "2025-05-24T10:30:00"
        }
    }

    ¿Por que devolver el role suelto Y tambien dentro de user?
    Porque el frontend necesita el role rapidamente para decidir
    a que pantalla redirigir (panel paciente o panel kine).
    Leerlo de la raiz es mas directo que de user.role.
    """
    access_token: str
    token_type: str = "bearer"    # Siempre "bearer" — es el estandar HTTP
    role: str                     # "paciente" o "kinesiologo"
    user: UserResponse            # Datos completos del usuario


# ── REGISTRO DE PACIENTE ──────────────────────────────────────

class RegisterPatientRequest(BaseModel):
    """
    Lo que manda el frontend cuando un paciente se registra.

    Ejemplo de JSON:
    {
        "full_name": "Carlos Perez",
        "email": "carlos@email.com",
        "password": "miContraseña123"
    }

    Validaciones:
    - email: Pydantic verifica formato automaticamente (EmailStr)
    - password: minimo 8 caracteres (Field con min_length)
    - full_name: minimo 2 caracteres, se le saca espacios de los bordes

    ¿Que es Field()?
    Es la forma de Pydantic de agregar restricciones extra a un campo.
    min_length=8 significa "si tiene menos de 8 caracteres, rechazar".
    strip_whitespace=True le saca los espacios al principio y al final.
    """
    full_name: str = Field(
        min_length=2,
        max_length=100,
        examples=["Carlos Perez"],
    )
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=100,
        examples=["miContraseña123"],
    )


# ── REGISTRO DE KINESIOLOGO ──────────────────────────────────

class RegisterKinesiologoRequest(BaseModel):
    """
    Lo que manda el frontend cuando un kinesiologo se registra.

    Tiene los mismos campos que el paciente + matricula y credencial.

    Ejemplo de JSON:
    {
        "full_name": "Dra. Maria Lopez",
        "email": "maria@kinova.com",
        "password": "miContraseña123",
        "matricula": "MN-12345",
        "credencial_url": "https://storage.kinova.com/credenciales/maria.pdf"
    }

    ¿Que es la credencial_url?
    Es un link a la imagen/PDF de la credencial profesional del kine.
    En el MVP no la verificamos automaticamente — es para que quede
    registrada y el admin la pueda revisar manualmente.
    None = todavia no la subio.
    """
    full_name: str = Field(
        min_length=2,
        max_length=100,
        examples=["Dra. Maria Lopez"],
    )
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=100,
    )
    matricula: str = Field(
        min_length=3,
        max_length=20,
        examples=["MN-12345"],
    )
    credencial_url: str | None = None


# ── TOKEN PAYLOAD ─────────────────────────────────────────────

class TokenPayload(BaseModel):
    """
    Estructura interna del JWT decodificado.
    No viaja por la red — se usa internamente para tipar el payload.

    Cuando decodificas un JWT, obtienes un dict:
        {"sub": "santi@kinova.com", "exp": 1716768000}

    Este schema le pone tipos a ese dict para que sea mas facil
    trabajar con el en el codigo (autocompletado, validacion).
    """
    sub: str | None = None    # "subject" = email del usuario
    exp: int | None = None    # "expiration" = timestamp de cuando expira
