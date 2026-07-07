"""
timezone.py — "Hoy" según la hora local del paciente, no la del servidor.

Render corre los contenedores en UTC. Los pacientes están en Argentina
(UTC-3), asi que entre las 21:00 y las 00:00 hora local el servidor ya
piensa que es el día siguiente. Esto rompía el cálculo de adherencia:
las rutinas "de hoy" (day_of_week) y las ejecuciones "de hoy" (started_at)
se comparaban contra el día calendario equivocado.
"""

from datetime import datetime, timezone
from zoneinfo import ZoneInfo

APP_TIMEZONE = ZoneInfo("America/Argentina/Buenos_Aires")

DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


def local_today_bounds() -> tuple[datetime, str]:
    """
    Devuelve (inicio del día de hoy en UTC, nombre del día) usando la hora
    local del paciente en vez de la hora del servidor.
    """
    now_local = datetime.now(APP_TIMEZONE)
    start_local = now_local.replace(hour=0, minute=0, second=0, microsecond=0)
    return start_local.astimezone(timezone.utc), DAYS[now_local.weekday()]
