"""
logging.py — Middleware de logging de requests.

Responsabilidad:
    Loggear cada request: método, ruta, status code, duración en ms.

Función planeada:
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration_ms = (time.time() - start) * 1000
        logger.info(f"{request.method} {request.url.path} "
                    f"-> {response.status_code} ({duration_ms:.0f}ms)")
        return response

Dependencias:
    - logging (stdlib)
    - time
"""

# TODO: import time, logging
# TODO: from fastapi import FastAPI, Request
# TODO: def setup_logging_middleware(app)
