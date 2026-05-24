# app/api/v1/

Primera versión pública de la API de Kinova.

## Archivos

- **`api.py`** — Agregador de routers. Incluye todos los routers de
  `routes/` en un único `APIRouter`. Este router se importa en `main.py`.
- **`routes/`** — Endpoints individuales agrupados por dominio.

## Prefijo

Todos los endpoints de esta versión se exponen bajo `/api/v1/...`
