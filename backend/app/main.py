"""
main.py — Entry point de la aplicación FastAPI.

Responsabilidad:
    Inicializar la aplicación FastAPI, registrar middlewares,
    montar los routers de la API, y configurar el ciclo de vida
    (lifespan) de la aplicación.

Propósito futuro:
    - Inicialización del motor de pose (MediaPipe) en startup
    - Cierre limpio de conexiones de DB en shutdown
    - Healthcheck endpoint para monitoreo
    - Configuración condicional según ENVIRONMENT

Dependencias:
    - fastapi
    - app.config.settings
    - app.middlewares
    - app.api.v1.api (router agregado)

Rol arquitectónico:
    Punto único de entrada. Todo arranque del servidor pasa por acá.
    Se ejecuta con: `uvicorn app.main:app --reload`
"""

# TODO: Importar FastAPI y crear instancia `app`
# TODO: Cargar settings desde app.config.settings
# TODO: Registrar middleware de CORS (usar FRONTEND_URL del .env)
# TODO: Registrar middleware de logging
# TODO: Registrar middleware de manejo global de excepciones
# TODO: Incluir router principal: app.include_router(api_router, prefix="/api/v1")
# TODO: Definir lifespan handler (startup + shutdown)
# TODO: Definir endpoint GET / con info básica de la API
# TODO: Definir endpoint GET /health para healthchecks
