"""
datetime.py — Helpers de fechas y semanas.

QUE HACE ESTE ARCHIVO:
    Funciones para trabajar con fechas, especificamente para calcular
    en que semana del tratamiento esta un paciente.

POR QUE ES IMPORTANTE:
    El kinesiologo define progresiones por semana:
        Semana 1 → sentadilla max 70 grados
        Semana 2 → sentadilla max 80 grados
        Semana 3 → sentadilla max 90 grados

    Para saber que limite aplicar HOY, necesitamos calcular:
    "¿en que semana del tratamiento estamos?"

    Eso depende de la fecha en que arranco el tratamiento (treatment_start_date
    en la tabla Patient) y la fecha de hoy.

    Ejemplo:
        treatment_start_date = 15 de mayo
        hoy = 26 de mayo (pasaron 11 dias)
        11 / 7 = semana 2 (dia 8 al 14 es semana 2)

POR QUE get_today() ES UNA FUNCION SEPARADA:
    Podrias usar date.today() directo en todos lados. Pero en los tests
    necesitas simular que "hoy es otro dia" para probar cosas como
    "¿que pasa en la semana 5?". Si usas date.today() hardcodeado,
    no podes controlar la fecha. Con get_today(), en los tests
    la reemplazas por una fecha fija y listo.

    Esto se llama "hacer algo testeable" — separar las cosas que
    dependen del mundo real (la fecha, la hora) para poder simularlas.
"""

from datetime import date, timedelta


def get_today() -> date:
    """
    Devuelve la fecha de hoy.

    ¿Por que existe si es solo una linea?
    Para que en los tests se pueda "mockear" (reemplazar) con
    cualquier fecha. Si en el codigo usaras date.today() directo,
    no lo podes reemplazar sin hacks raros.
    """
    return date.today()


def calculate_week_number(
    start_date: date,
    today: date | None = None,
) -> int:
    """
    Calcula en que semana del tratamiento estamos.

    Parametros:
        start_date: cuando arranco el tratamiento
        today: fecha actual (si no se pasa, usa hoy).
               Se puede pasar otra fecha para tests o simulaciones.

    Retorna:
        Numero de semana (1-indexed):
            Dia 1-7   → semana 1
            Dia 8-14  → semana 2
            Dia 15-21 → semana 3
            ...

    Ejemplos:
        start = 1 de mayo, today = 1 de mayo  → semana 1 (dia 1)
        start = 1 de mayo, today = 7 de mayo  → semana 1 (dia 7)
        start = 1 de mayo, today = 8 de mayo  → semana 2 (dia 8)
        start = 1 de mayo, today = 30 de mayo → semana 5 (dia 30)

    Si today es anterior a start_date, devuelve 1 (no puede ser 0).
    """
    if today is None:
        today = get_today()

    # Cuantos dias pasaron desde el inicio
    days_elapsed = (today - start_date).days

    # Si es antes del inicio (raro pero posible), semana 1
    if days_elapsed < 0:
        return 1

    # Division entera + 1 porque es 1-indexed
    # Dia 0-6 → 0//7=0 + 1 = semana 1
    # Dia 7-13 → 7//7=1 + 1 = semana 2
    return (days_elapsed // 7) + 1


def day_of_week_today(today: date | None = None) -> int:
    """
    Devuelve el dia de la semana como numero (0=lunes, 6=domingo).

    ¿Por que numero y no "monday"?
    Porque en la base de datos guardamos el dia como numero
    (es mas facil comparar 0 == 0 que "monday" == "monday",
    y evitas errores de mayusculas/minusculas/idioma).

    Mapeo:
        0 = Lunes
        1 = Martes
        2 = Miercoles
        3 = Jueves
        4 = Viernes
        5 = Sabado
        6 = Domingo
    """
    if today is None:
        today = get_today()
    return today.weekday()  # Python ya usa 0=lunes por defecto


def get_week_range(d: date | None = None) -> tuple[date, date]:
    """
    Devuelve el lunes y domingo de la semana que contiene la fecha 'd'.

    Retorna:
        (lunes, domingo) como tupla de dos dates.

    Ejemplo:
        Si d = miercoles 28 de mayo 2025:
            lunes = 26 de mayo
            domingo = 1 de junio
        → devuelve (date(2025, 5, 26), date(2025, 6, 1))

    ¿Para que sirve?
    Para el endpoint "rutinas de esta semana" — necesitamos saber
    que sesiones cayeron entre el lunes y el domingo de esta semana.
    """
    if d is None:
        d = get_today()

    # weekday() devuelve 0 para lunes, asi que restamos eso
    # para "retroceder" al lunes de esta semana
    monday = d - timedelta(days=d.weekday())
    sunday = monday + timedelta(days=6)

    return monday, sunday
