"""
security.py — Hashing de contraseñas y tokens JWT.

QUE HACE ESTE ARCHIVO:
    Resuelve dos problemas de seguridad fundamentales:

    1. CONTRASEÑAS: nunca guardamos la contraseña real en la base de datos.
       Guardamos un "hash" — una version irreversible. Si alguien hackea
       la DB, ve "a$2b$12$xK9z..." en vez de "miPerro123".

    2. TOKENS JWT: cuando un usuario se loguea, le damos un "pase"
       (token) que incluye en cada request. Asi no tiene que mandar
       usuario y contraseña cada vez que hace click.

ANALOGIA PASSWORDS (hashing):
    Imaginate una licuadora industrial. Metes una manzana (contraseña),
    la licuas, y sale un jugo unico. Pero NO podes reconstruir la
    manzana a partir del jugo. Eso es un hash:
    - "miPerro123"  →  "$2b$12$xK9z8kQ..."  (facil)
    - "$2b$12$xK9z8kQ..."  →  "miPerro123"  (IMPOSIBLE)

    Cuando el usuario se loguea, licuamos lo que escribio y comparamos
    los dos jugos. Si son iguales, la contraseña es correcta.

ANALOGIA JWT (tokens):
    Imaginate un pulsera de boliche. Te la ponen en la entrada (login),
    y despues con esa pulsera entras y salis sin hacer la fila de
    nuevo. La pulsera tiene tu nombre adentro (datos del usuario)
    y una marca especial que solo el boliche puede hacer (la firma).
    Si alguien intenta falsificar la pulsera, la marca no coincide
    y lo rechazan.

    El token JWT es esa pulsera:
    - Se crea al loguearse (create_access_token)
    - Viene en cada request (el front lo manda en el header)
    - Se verifica en cada endpoint protegido (decode_access_token)
    - Expira despues de X horas (no sirve para siempre)

COMO SE USA EN OTROS ARCHIVOS:
    from app.core.security import hash_password, verify_password
    from app.core.security import create_access_token, decode_access_token

    # Al registrar un usuario:
    hashed = hash_password("miPerro123")
    # hashed = "$2b$12$xK9z8kQ..." ← esto se guarda en la DB

    # Al loguearse:
    if verify_password("miPerro123", hashed):
        token = create_access_token({"sub": "usuario@email.com"})
        # token = "eyJhbGci..." ← esto se le manda al frontend

    # Al recibir un request protegido:
    payload = decode_access_token(token)
    # payload = {"sub": "usuario@email.com", "exp": 1716768000}
"""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config.settings import settings


# ── HASHING DE CONTRASEÑAS ────────────────────────────────────

# CryptContext es el "motor" de hashing de passlib.
#
# schemes=["bcrypt"]:
#   Usa bcrypt, el algoritmo mas usado para passwords.
#   ¿Por que bcrypt y no MD5 o SHA256?
#   Porque bcrypt es LENTO a proposito. Si un hacker roba la DB
#   e intenta probar millones de contraseñas, con MD5 puede probar
#   1 billon por segundo. Con bcrypt, solo unas miles. Esa lentitud
#   intencional protege a los usuarios.
#
# deprecated="auto":
#   Si en el futuro se cambia el algoritmo (ej: de bcrypt a argon2),
#   passlib detecta los hashes viejos y los re-hashea
#   automaticamente cuando el usuario se loguea. No tenes que
#   migrar nada a mano.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """
    Recibe la contraseña en texto plano y devuelve el hash.
    Se usa UNA vez: cuando el usuario se registra.

    Ejemplo:
        hash_password("miPerro123")
        → "$2b$12$xK9z8kQ7Yw1..."  (60 caracteres, siempre distinto)

    ¿Por que siempre distinto? Porque bcrypt agrega un "salt" (sal)
    aleatorio cada vez. Asi, si dos usuarios tienen la misma contraseña,
    sus hashes son DISTINTOS. Un hacker no puede comparar hashes para
    encontrar contraseñas repetidas.
    """
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """
    Compara la contraseña que el usuario escribio (plain) con el
    hash que esta guardado en la base de datos (hashed).

    Devuelve True si coinciden, False si no.

    Se usa cada vez que alguien intenta loguearse.

    Ejemplo:
        verify_password("miPerro123", "$2b$12$xK9z8kQ7...")  → True
        verify_password("contraMal", "$2b$12$xK9z8kQ7...")   → False
    """
    return pwd_context.verify(plain, hashed)


# ── TOKENS JWT ────────────────────────────────────────────────

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Crea un token JWT con los datos del usuario adentro.

    Parametros:
        data: diccionario con los datos a meter en el token.
              Por convencion, el identificador del usuario va en "sub"
              (subject). Ejemplo: {"sub": "usuario@email.com"}
        expires_delta: cuanto tiempo dura el token. Si no se pasa,
                       usa ACCESS_TOKEN_EXPIRE_MINUTES del .env.

    Retorna:
        Un string tipo "eyJhbGciOiJIUzI1NiIs..." que es el token.

    ¿Que tiene adentro un JWT? Tres partes separadas por puntos:
        eyJhbGci.eyJzdWIi.SflKxwRJ
        ────────  ────────  ────────
        Header    Payload   Firma
        (algoritmo) (datos)  (verificacion)

    El payload tiene los datos que le pasaste + la fecha de expiracion.
    La firma se genera con la SECRET_KEY — sin esa clave, nadie puede
    crear un token valido.
    """
    # Copiamos para no modificar el diccionario original
    to_encode = data.copy()

    # Calculamos cuando expira
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    # Agregamos la expiracion al payload
    # "exp" es un campo estandar de JWT — las librerias lo verifican
    # automaticamente. Si el token expiro, jwt.decode() tira error.
    to_encode["exp"] = expire

    # Creamos el token firmandolo con nuestra clave secreta
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )

    return encoded_jwt


def decode_access_token(token: str) -> dict | None:
    """
    Recibe un token JWT y lo decodifica para leer los datos de adentro.

    Si el token es valido → devuelve el payload (ej: {"sub": "email@..."})
    Si el token es invalido, expirado o trucho → devuelve None

    Se usa en CADA request protegido. El flujo es:
        1. El frontend manda el token en el header: Authorization: Bearer eyJhbG...
        2. El backend extrae el token
        3. Llama a decode_access_token(token)
        4. Si devuelve None → 401 Unauthorized (no pasas)
        5. Si devuelve datos → sabemos quien es el usuario

    ¿Por que puede fallar?
        - Token expirado (paso mas de 24h)
        - Token modificado (alguien cambio un caracter)
        - Token firmado con otra SECRET_KEY (falsificacion)
        - Token mal formado (basura random)
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError:
        # JWTError cubre todos los casos: expirado, invalido, etc.
        # Devolvemos None en vez de tirar la excepcion — el que llama
        # decide que hacer (generalmente devolver 401).
        return None
