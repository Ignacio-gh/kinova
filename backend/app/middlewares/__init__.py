"""
app/middlewares/ — Middlewares de FastAPI.

Re-exporta las funciones de setup para usarlas mas facil en main.py:
    from app.middlewares import setup_cors, setup_exception_handlers, setup_logging_middleware
"""

from app.middlewares.cors import setup_cors
from app.middlewares.error_handler import setup_exception_handlers
from app.middlewares.logging import setup_logging_middleware

__all__ = ["setup_cors", "setup_exception_handlers", "setup_logging_middleware"]
