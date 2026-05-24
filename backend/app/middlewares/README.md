# app/middlewares/

Middlewares de FastAPI. Se ejecutan en cada request antes/después del
endpoint.

## Archivos

- **`cors.py`** — Configuración de CORS para permitir requests del
  frontend (localhost:5173 en dev).
- **`logging.py`** — Log estructurado de cada request (método, ruta,
  status, duración).
- **`error_handler.py`** — Atrapa excepciones del dominio
  (definidas en `core/exceptions.py`) y las traduce a respuestas HTTP
  con status code y formato consistentes.

## Orden de registro

En `main.py`:
1. CORS (primero, para que las preflight requests pasen)
2. Logging
3. Error handler (último, para atrapar todo)
