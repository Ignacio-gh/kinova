"""
app/db/ — Paquete de conexion a la base de datos.

Re-exporta lo que otros archivos necesitan:
    from app.db import get_db          # para inyectar en endpoints
    from app.db import engine          # para cerrar al apagar el server
"""

from app.db.session import AsyncSessionLocal, engine, get_db

__all__ = ["engine", "AsyncSessionLocal", "get_db"]
