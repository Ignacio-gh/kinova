"""
session.py — Conexion a la base de datos.

QUE HACE ESTE ARCHIVO:
    Crea dos cosas:
    1. El "engine" — el motor que sabe COMO conectarse a la base de datos
    2. La "session factory" — una fabrica que crea sesiones (conversaciones
       con la base de datos) cada vez que un endpoint las necesita

ANALOGIA PARA ENTENDERLO:
    Pensalo como un banco:
    - El ENGINE es la sucursal del banco (la conexion fisica)
    - La SESSION es una ventanilla — cada cliente (request HTTP)
      se acerca a una ventanilla, hace sus operaciones, y la cierra
    - get_db() es el sistema de turnos — te da una ventanilla,
      y cuando terminas, la libera para el siguiente

POR QUE ASYNC (ASINCRONO):
    Un servidor web recibe muchos pedidos a la vez. Si usamos conexiones
    "normales" (sincronas), mientras un pedido espera que la base de datos
    responda, el servidor se queda TRABADO sin poder atender a nadie mas.
    Con async, mientras espera la respuesta de la DB, atiende otros pedidos.
    Es como un mozo que no se queda parado esperando que la cocina termine
    un plato — va a tomar el pedido de otra mesa.

COMO SE USA EN OTROS ARCHIVOS:
    from app.db.session import get_db

    @router.get("/algo")
    async def mi_endpoint(db: AsyncSession = Depends(get_db)):
        # 'db' ya es una sesion abierta, lista para hacer queries
        resultado = await db.execute(select(User))
        # cuando el endpoint termina, get_db cierra la sesion sola
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.config.settings import settings


# ── 1. ENGINE (el motor de conexion) ──────────────────────────
# create_async_engine recibe la URL de la base de datos y crea
# el motor asincrono.
#
# Parametros:
#   - settings.DATABASE_URL: viene del .env (lo que hicimos en paso 1)
#   - echo: si es True, imprime TODAS las queries SQL en la consola.
#     Util para debuggear, molesto en produccion. Por eso lo atamos
#     a settings.DEBUG — en desarrollo se ve, en produccion no.
# asyncpg requiere SSL explícito para conectar a Supabase (y a PostgreSQL en general).
# Para SQLite (desarrollo local) no se pasa connect_args.
_is_postgres = settings.DATABASE_URL.startswith("postgresql")

if _is_postgres:
    # Supabase Supavisor en Transaction mode (puerto 6543) YA es un pool.
    # SQLAlchemy no debe tener pool propio encima — usar NullPool para que
    # cada request tome y devuelva una conexión directamente a Supavisor.
    # Esto elimina el "doble pool" que causaba 500 intermitentes.
    import uuid
    _connect_args = {
        "ssl": "require",
        "statement_cache_size": 0,
        "prepared_statement_name_func": lambda: f"__asyncpg_{uuid.uuid4().hex}__",
    }
    _pool_kwargs = {"poolclass": NullPool}
else:
    _connect_args = {}
    _pool_kwargs = {}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args=_connect_args,
    **_pool_kwargs,
)


# ── 2. SESSION FACTORY (la fabrica de sesiones) ───────────────
# async_sessionmaker es una "fabrica": cada vez que la llamas,
# te da una sesion nueva (una ventanilla nueva).
#
# Parametros:
#   - bind=engine: "usa ESTE motor para conectarte"
#   - expire_on_commit=False: despues de hacer commit, los objetos
#     que leiste de la DB siguen siendo accesibles. Sin esto,
#     al hacer commit, si intentas leer un campo te tira error
#     porque Pydantic necesita acceder a los datos para serializar
#     la respuesta JSON.
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
)


# ── 3. GET_DB (el sistema de turnos) ──────────────────────────
# Esta funcion es un "dependency" de FastAPI. Cada endpoint que
# necesite hablar con la base de datos la recibe automaticamente.
#
# ¿Que es "yield"?
#   Es como decir "te presto esto, usalo, y cuando termines
#   vuelvo yo para cerrar todo". El flujo es:
#
#   1. Se crea la sesion (async with AsyncSessionLocal())
#   2. Se la "presta" al endpoint (yield session)
#   3. El endpoint hace sus queries
#   4. Si todo salio bien → commit (guarda los cambios)
#   5. Si algo exploto → rollback (deshace todo, como si nada paso)
#   6. La sesion se cierra automaticamente (el "async with" se encarga)
#
# ¿Por que rollback?
#   Imaginate que un endpoint hace 3 cambios en la DB. El cambio 2
#   explota. Sin rollback, el cambio 1 queda guardado y los otros no
#   → datos inconsistentes. Con rollback, se deshace TODO → la DB
#   queda como estaba antes, limpia.
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
