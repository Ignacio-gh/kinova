"""
datetime.py — Helpers de fechas y semanas.

Funciones planeadas:
    def get_today() -> date:
        '''Devuelve hoy. Útil para mockear en tests.'''

    def calculate_week_number(start_date: date, today: date | None = None) -> int:
        '''
        Devuelve la semana del tratamiento (1-indexed).
        Día 1-7 = semana 1, día 8-14 = semana 2, etc.
        '''

    def day_of_week_today() -> str:
        '''Devuelve "monday", "tuesday", etc.'''

    def get_week_range(date) -> tuple[date, date]:
        '''Devuelve (lunes, domingo) de la semana que contiene `date`.'''

Dependencias:
    - datetime (stdlib)
"""

# TODO: from datetime import date, datetime, timedelta
# TODO: def get_today()
# TODO: def calculate_week_number(start_date, today=None)
# TODO: def day_of_week_today()
# TODO: def get_week_range(d)
