# app/config/

Configuración centralizada del backend.

## Archivos

- **`settings.py`** — Clase `Settings` (pydantic-settings) que lee el
  archivo `.env` y expone las variables tipadas.

## Uso

```python
from app.config.settings import settings

settings.DATABASE_URL    # str
settings.SECRET_KEY      # str
settings.DEBUG           # bool
```

## Variables expuestas

Ver `.env.example` en la raíz del backend para la lista completa.
