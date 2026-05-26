"""
logging.py — Middleware de logging de requests.

QUE HACE ESTE ARCHIVO:
    Imprime una linea en la consola por cada request que recibe el
    servidor. Asi sabes que esta pasando sin tener que adivinar.

    Ejemplo de lo que se ve en la terminal cuando el server corre:
        INFO  | POST /api/v1/auth/login → 200 (45ms)
        INFO  | GET  /api/v1/routines/today → 200 (12ms)
        WARN  | GET  /api/v1/patients/999 → 404 (8ms)
        ERROR | POST /api/v1/sessions → 500 (102ms)

POR QUE EXISTE:
    Cuando algo falla y no sabes por que, lo primero que miras son
    los logs. Sin este middleware, no tenes idea de que requests
    llegaron, cuanto tardaron, ni que status devolvieron.

QUE ES UN MIDDLEWARE:
    Un middleware es una funcion que se ejecuta ANTES y DESPUES de
    cada request. Es como un peaje en la ruta:
        1. El request llega → el middleware lo ve (ANTES)
        2. El endpoint procesa el request
        3. La respuesta sale → el middleware la ve (DESPUES)

    En nuestro caso:
        ANTES: anotamos la hora de inicio
        DESPUES: calculamos cuanto tardo y lo loggeamos

COMO SE USA:
    # En main.py:
    from app.middlewares.logging import setup_logging_middleware
    setup_logging_middleware(app)
"""

import logging
import time

from fastapi import FastAPI, Request

# ── CONFIGURACION DEL LOGGER ─────────────────────────────────
# logging es la libreria de Python para imprimir mensajes con
# niveles de importancia (DEBUG, INFO, WARNING, ERROR).
#
# ¿Por que no usar print()?
# Porque print() no tiene niveles. Con logging podes filtrar:
# "mostrame solo los errores" o "mostrame todo incluyendo debug".
# Ademas, en produccion podes mandar los logs a un archivo o a
# un servicio externo (DataDog, CloudWatch, etc).
logger = logging.getLogger("kinova")


def setup_logging_middleware(app: FastAPI) -> None:
    """Registra el middleware de logging en la app."""

    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        """
        Se ejecuta en CADA request. Mide el tiempo y loggea el resultado.

        Parametros:
            request: el request HTTP que llego (metodo, URL, headers, etc)
            call_next: una funcion que ejecuta el endpoint real.
                       Es como decir "dale, segui con lo que venias".
        """
        # ANTES: guardamos el momento exacto en que llego el request
        start = time.time()

        # Ejecutamos el endpoint (aca adentro pasa toda la magia)
        response = await call_next(request)

        # DESPUES: calculamos cuanto tardo
        duration_ms = (time.time() - start) * 1000

        # Elegimos el nivel de log segun el status code
        # 5xx = error del server → ERROR (rojo, urgente)
        # 4xx = error del cliente → WARNING (amarillo, ojo)
        # 2xx/3xx = todo bien → INFO (blanco, normal)
        status = response.status_code
        if status >= 500:
            logger.error(
                "%s %s → %d (%.0fms)", request.method, request.url.path,
                status, duration_ms,
            )
        elif status >= 400:
            logger.warning(
                "%s %s → %d (%.0fms)", request.method, request.url.path,
                status, duration_ms,
            )
        else:
            logger.info(
                "%s %s → %d (%.0fms)", request.method, request.url.path,
                status, duration_ms,
            )

        return response
