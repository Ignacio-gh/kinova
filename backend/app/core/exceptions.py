"""
exceptions.py — Excepciones personalizadas de Kinova.

QUE HACE ESTE ARCHIVO:
    Define errores especificos de nuestro sistema. En vez de que todo
    explote con un error generico de Python, creamos errores con nombre
    propio que dicen EXACTAMENTE que paso y que codigo HTTP devolver.

POR QUE NO USAR EXCEPCIONES GENERICAS:
    Imaginate que algo falla y Python te dice:
        Exception: "algo salio mal"
    ¿Que haces con eso? Nada. No sabes si fue un mail duplicado,
    un paciente que no existe, o un token vencido.

    Con excepciones custom:
        EmailAlreadyRegisteredError: "ya existe una cuenta con ese email"
    Ahora si sabes que paso, que devolver al frontend (400), y que
    mensaje mostrarle al usuario.

COMO FUNCIONA EL SISTEMA:
    1. Un service detecta un problema → lanza una excepcion custom
    2. El middleware error_handler la atrapa automaticamente
    3. La convierte en una respuesta HTTP con el codigo correcto
    4. El frontend recibe {"detail": "mensaje"} y muestra el error

    Ejemplo:
        # En auth_service.py (paso futuro):
        user = await repo.get_by_email(email)
        if user is not None:
            raise EmailAlreadyRegisteredError(email)
        # ↓
        # El middleware la atrapa y devuelve:
        # HTTP 400 {"detail": "Ya existe una cuenta con el email santi@kinova.com"}

QUE ES EL status_code:
    Es el numero HTTP que le dice al frontend que tipo de error fue:
    - 400 = "Mandaste algo mal" (datos invalidos, duplicados)
    - 401 = "No se quien sos" (credenciales incorrectas)
    - 403 = "Se quien sos pero no podes hacer esto" (sin permiso)
    - 404 = "Lo que buscas no existe"
    - 500 = "Algo exploto internamente" (error del server)
"""


# ── CLASE BASE ────────────────────────────────────────────────
# Todas nuestras excepciones heredan de esta. Asi el middleware
# puede atrapar CUALQUIER error de dominio con:
#   except DomainError as e:
# en vez de poner un except por cada una.

class DomainError(Exception):
    """
    Clase madre de todos los errores de dominio de Kinova.

    Atributos:
        message: el texto que se muestra al usuario
        status_code: el codigo HTTP que se devuelve (400, 401, etc)
    """

    status_code: int = 400  # default, cada hija puede cambiarlo

    def __init__(self, message: str = "Error de dominio"):
        self.message = message
        super().__init__(self.message)


# ── AUTH (autenticacion) ──────────────────────────────────────

class InvalidCredentialsError(DomainError):
    """
    Email o contraseña incorrectos al intentar loguearse.
    HTTP 401 porque no pudimos verificar quien es.
    """
    status_code = 401

    def __init__(self):
        super().__init__("Email o contraseña incorrectos")


class EmailAlreadyRegisteredError(DomainError):
    """
    Alguien intenta registrarse con un email que ya existe.
    HTTP 400 porque el pedido esta mal (el email ya esta tomado).
    """
    status_code = 400

    def __init__(self, email: str):
        super().__init__(f"Ya existe una cuenta con el email {email}")


class UnauthorizedError(DomainError):
    """
    El usuario esta logueado pero no tiene permiso para esta accion.
    Ejemplo: un paciente intenta acceder al panel de kinesiologo.
    HTTP 403 = "Forbidden" (prohibido).
    """
    status_code = 403

    def __init__(self, message: str = "No tenés permiso para esta acción"):
        super().__init__(message)


# ── PATIENTS (pacientes) ──────────────────────────────────────

class PatientNotFoundError(DomainError):
    """
    Se busco un paciente por ID y no existe.
    HTTP 404 = "Not Found".
    """
    status_code = 404

    def __init__(self, patient_id: int):
        super().__init__(f"No se encontró el paciente con ID {patient_id}")


class PatientNotBelongsToKinesiologoError(DomainError):
    """
    Un kinesiologo intenta ver/modificar un paciente que no es suyo.
    HTTP 403 porque no tiene permiso sobre ESE paciente.
    """
    status_code = 403

    def __init__(self):
        super().__init__("Este paciente no pertenece a tu lista de pacientes")


# ── ROUTINES & PROGRESSIONS (rutinas y progresiones) ──────────

class RoutineNotFoundError(DomainError):
    """Rutina no encontrada."""
    status_code = 404

    def __init__(self, routine_id: int):
        super().__init__(f"No se encontró la rutina con ID {routine_id}")


class InvalidDayOfWeekError(DomainError):
    """
    El dia de la semana no es valido (debe ser 0-6, lunes a domingo).
    """
    status_code = 400

    def __init__(self, day: int):
        super().__init__(
            f"Día de la semana inválido: {day}. Debe ser entre 0 (lunes) y 6 (domingo)"
        )


class InvalidProgressionWeekError(DomainError):
    """
    El numero de semana de la progresion no es valido.
    Ejemplo: semana 0 o semana negativa.
    """
    status_code = 400

    def __init__(self, week: int):
        super().__init__(f"Número de semana inválido: {week}. Debe ser >= 1")


class DuplicateProgressionError(DomainError):
    """
    Ya existe una progresion para esa rutina en esa semana.
    Ejemplo: el kine intenta crear progresion semana 3
    pero ya habia creado una para semana 3.
    """
    status_code = 400

    def __init__(self, routine_id: int, week: int):
        super().__init__(
            f"Ya existe una progresión para la rutina {routine_id} en la semana {week}"
        )


# ── SESSIONS (sesiones de ejercicio) ──────────────────────────

class SessionNotFoundError(DomainError):
    """Sesion de ejercicio no encontrada."""
    status_code = 404

    def __init__(self, session_id: int):
        super().__init__(f"No se encontró la sesión con ID {session_id}")


class SessionAlreadyEndedError(DomainError):
    """
    Se intenta modificar una sesion que ya termino.
    Ejemplo: mandar frames de pose a una sesion que ya cerro.
    """
    status_code = 400

    def __init__(self, session_id: int):
        super().__init__(f"La sesión {session_id} ya fue finalizada")


# ── POSE (deteccion de pose) ─────────────────────────────────

class InvalidFrameError(DomainError):
    """
    El frame de video que mando el frontend no se puede procesar.
    Ejemplo: imagen corrupta, formato invalido, etc.
    """
    status_code = 400

    def __init__(self, reason: str = "Frame inválido"):
        super().__init__(f"No se pudo procesar el frame: {reason}")


class PoseDetectionError(DomainError):
    """
    Error interno de MediaPipe al procesar la pose.
    HTTP 500 porque es un error del server, no del usuario.
    """
    status_code = 500

    def __init__(self, reason: str = "Error en la detección de pose"):
        super().__init__(reason)
