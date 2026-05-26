"""
app/config/ — Paquete de configuracion.

Este __init__.py re-exporta `settings` para que se pueda importar de
dos formas (las dos funcionan, es cuestion de gusto):

    from app.config.settings import settings   # explicito
    from app.config import settings            # mas corto
"""

from app.config.settings import settings

__all__ = ["settings"]
