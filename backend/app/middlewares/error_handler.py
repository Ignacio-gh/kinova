"""
error_handler.py — Middleware global de manejo de errores.

QUE HACE ESTE ARCHIVO:
    Atrapa TODAS las excepciones custom que tiramos en los services
    (las que definimos en exceptions.py) y las convierte en respuestas
    HTTP con formato consistente.

POR QUE EXISTE:
    Sin esto, tendrias que poner try/except en CADA endpoint:

        @router.post("/login")
        async def login(...):
            try:
                return await auth_service.login(email, password)
            except InvalidCredentialsError as e:
                return JSONResponse(status_code=401, ...)
            except EmailAlreadyRegisteredError as e:
                return JSONResponse(status_code=400, ...)
            # ... y asi con cada error, en cada endpoint

    Con el error handler, los endpoints solo hacen:

        @router.post("/login")
        async def login(...):
            return await auth_service.login(email, password)
            # si login() tira InvalidCredentialsError, el middleware
            # la atrapa SOLO y devuelve el JSON correcto

    Es como un try/except GLOBAL que envuelve todos los endpoints.

FORMATO DE RESPUESTA:
    Siempre devuelve el mismo formato JSON para que el frontend
    sepa que esperar:
    {
        "error": "InvalidCredentialsError",    ← nombre de la excepcion
        "message": "Email o contraseña ...",   ← mensaje para el usuario
        "status_code": 401                     ← codigo HTTP
    }

COMO SE USA:
    # En main.py:
    from app.middlewares.error_handler import setup_exception_handlers
    setup_exception_handlers(app)
"""

import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import DomainError

logger = logging.getLogger("kinova")


def setup_exception_handlers(app: FastAPI) -> None:
    """
    Registra los exception handlers en la app.

    ¿Que es un exception handler?
    Es una funcion que FastAPI llama automaticamente cuando una
    excepcion de cierto tipo no fue atrapada por nadie. FastAPI
    la intercepta y en vez de mostrar un error feo, ejecuta
    nuestra funcion que devuelve un JSON limpio.
    """

    # ── Handler para TODAS las excepciones de dominio ─────────
    # Gracias a la herencia, este unico handler atrapa las 13
    # excepciones que definimos en exceptions.py. Cualquier
    # excepcion nueva que herede de DomainError se atrapa aca
    # automaticamente — no hay que tocar este archivo.
    @app.exception_handler(DomainError)
    async def domain_error_handler(request: Request, exc: DomainError):
        # Loggeamos el error para poder debuggear
        logger.warning(
            "%s %s → %s: %s",
            request.method,
            request.url.path,
            type(exc).__name__,
            exc.message,
        )

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": type(exc).__name__,
                "message": exc.message,
                "status_code": exc.status_code,
            },
        )

    # ── Handler para errores inesperados (los que no prevenimos) ──
    # Si algo que NO es DomainError explota (un bug, un error de
    # Python, algo que no previmos), esto lo atrapa y devuelve
    # un 500 generico. Asi el frontend nunca recibe un HTML de
    # error feo o un traceback de Python.
    @app.exception_handler(Exception)
    async def generic_error_handler(request: Request, exc: Exception):
        # Capturar errores de DNS o conexión específicamente
        error_str = str(exc)
        if "getaddrinfo failed" in error_str or "Connection refused" in error_str:
            logger.critical("Falla de conectividad: No se pudo alcanzar la base de datos.")
            return JSONResponse(
                status_code=503,
                content={
                    "error": "ServiceUnavailable",
                    "message": "Error de conexión con el servidor de base de datos. Verifique su internet o DNS.",
                    "status_code": 503,
                },
            )

        logger.error(
            "%s %s → Error inesperado: %s",
            request.method,
            request.url.path,
            str(exc),
            exc_info=True,
        )

        return JSONResponse(
            status_code=500,
            content={
                "error": "InternalServerError",
                "message": "Error interno del servidor",
                "status_code": 500,
            },
        )
