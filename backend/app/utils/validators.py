"""
validators.py — Validadores reutilizables.

QUE HACE ESTE ARCHIVO:
    Funciones que verifican si un dato es valido antes de procesarlo.
    Se usan en los schemas (Pydantic) y en los services.

POR QUE SEPARAR LOS VALIDADORES:
    Si pones la validacion de email en el schema de registro Y en
    el schema de editar perfil, tenes la misma logica duplicada.
    Si despues queres cambiar la regex del email, tenes que
    acordarte de cambiarla en los dos lugares.

    Aca centralizamos: una funcion, un solo lugar.
"""

import re


# ── EMAIL ─────────────────────────────────────────────────────

# Regex para validar emails. No es perfecta (validar emails
# 100% con regex es tecnicamente imposible), pero cubre el 99%
# de los casos reales.
#
# Acepta: santi@kinova.com, maria.lopez@uade.edu.ar
# Rechaza: santi@, @kinova.com, santi kinova.com
_EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)


def is_valid_email(email: str) -> bool:
    """
    Verifica que el string sea un email con formato valido.

    Ejemplo:
        is_valid_email("santi@kinova.com")  → True
        is_valid_email("no-es-un-email")    → False
        is_valid_email("")                  → False
    """
    return bool(_EMAIL_REGEX.match(email))


# ── MATRICULA ─────────────────────────────────────────────────

def is_valid_matricula(matricula: str) -> bool:
    """
    Verifica que la matricula del kinesiologo sea valida.

    Reglas:
        - No puede estar vacia
        - Solo letras, numeros, guiones y barras
        - Entre 3 y 20 caracteres

    Formato tipico: "MN-12345" o "MP12345/2"

    Nota: no validamos contra una base de datos de matriculas
    reales — eso excede el MVP. Solo chequeamos formato.
    """
    if not matricula or not matricula.strip():
        return False
    return bool(re.match(r"^[a-zA-Z0-9\-/]{3,20}$", matricula))


# ── ANGULOS (para progresiones) ───────────────────────────────

def is_valid_angle_range(angle_min: float, angle_max: float) -> bool:
    """
    Verifica que el rango de angulos sea valido para una progresion.

    Reglas:
        - Ambos entre 0 y 180 grados (rango anatomico de una rodilla)
        - El minimo tiene que ser menor que el maximo

    Ejemplo:
        is_valid_angle_range(30, 90)   → True  (sentadilla semana 1)
        is_valid_angle_range(90, 30)   → False (min > max)
        is_valid_angle_range(-10, 90)  → False (negativo)
        is_valid_angle_range(30, 200)  → False (>180)

    ¿Por que 0 a 180?
    Porque el angulo de la rodilla (entre femur y tibia) va de
    0 grados (pierna totalmente doblada) a 180 grados (pierna
    totalmente estirada). Anatomicamente no puede pasar de ahi.
    """
    if not (0 <= angle_min <= 180):
        return False
    if not (0 <= angle_max <= 180):
        return False
    if angle_min >= angle_max:
        return False
    return True


# ── DIA DE LA SEMANA ──────────────────────────────────────────

def is_valid_day_of_week(day: int) -> bool:
    """
    Verifica que el numero de dia de la semana sea valido.

    Acepta 0 a 6:
        0 = Lunes
        1 = Martes
        2 = Miercoles
        3 = Jueves
        4 = Viernes
        5 = Sabado
        6 = Domingo

    Ejemplo:
        is_valid_day_of_week(0)  → True  (lunes)
        is_valid_day_of_week(6)  → True  (domingo)
        is_valid_day_of_week(7)  → False (no existe)
        is_valid_day_of_week(-1) → False
    """
    return isinstance(day, int) and 0 <= day <= 6
