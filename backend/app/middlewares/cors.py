"""
cors.py — Configuracion de CORS.

QUE ES CORS:
    Cuando tu frontend (React en localhost:5173) intenta hablar con
    tu backend (FastAPI en localhost:8000), el NAVEGADOR lo bloquea
    por seguridad. ¿Por que? Porque son dos "origenes" distintos
    (distinto puerto = distinto origen).

    Esto se llama "Same-Origin Policy" — el browser no deja que una
    pagina en un dominio hable con otro dominio sin permiso.

    CORS (Cross-Origin Resource Sharing) es la forma de dar ese permiso.
    Basicamente el backend le dice al browser: "tranqui, yo autorizo
    a localhost:5173 a hablar conmigo".

    Sin esto, TODOS los requests del frontend al backend fallan con:
        "Access to fetch at 'http://localhost:8000' from origin
        'http://localhost:5173' has been blocked by CORS policy"

QUE HACE ESTE ARCHIVO:
    Agrega el middleware de CORS a la app de FastAPI. Es UNA funcion
    que se llama una sola vez al arrancar el servidor.

COMO SE USA:
    # En main.py:
    from app.middlewares.cors import setup_cors
    setup_cors(app)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def setup_cors(app: FastAPI) -> None:
    """
    Agrega el middleware CORS a la aplicacion.

    Parametros del middleware:
        allow_origins: lista de URLs que pueden hablar con el backend.
            Usamos ["*"] (todos) — ver comentario mas abajo del por que.
            settings.FRONTEND_URL NO se usa aca (solo se loguea en
            main.py al arrancar); no confundir una cosa con la otra.

        allow_credentials: permite que el frontend mande cookies y
            headers de autenticacion (el token JWT va en un header).
            Sin esto, el header "Authorization: Bearer ..." se bloquea.

        allow_methods: que metodos HTTP se permiten.
            ["*"] = todos (GET, POST, PUT, DELETE, etc).
            Podriamos restringirlo, pero para un MVP no hace falta.

        allow_headers: que headers puede mandar el frontend.
            ["*"] = todos. El mas importante es "Authorization"
            (donde va el token JWT).
    """
    # Aceptamos todos los orígenes: cubre Vercel, dominio custom, Expo Go
    # y desarrollo local sin tener que listar cada URL.
    # El JWT viaja en el header Authorization (no en cookies), por lo que
    # allow_credentials=False es correcto y compatible con allow_origins=["*"].
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
