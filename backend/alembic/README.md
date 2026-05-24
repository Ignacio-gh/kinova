# alembic/

Migraciones de la base de datos.

> 📌 **Responsable:** Agus

## ¿Qué es Alembic?

Es la herramienta de migraciones de SQLAlchemy. Permite **versionar
el esquema de la DB**: cada cambio en `models/` se traduce en un
archivo de migración bajo `versions/` que la herramienta aplica
en orden.

## Workflow

```bash
# 1. Después de cambiar/agregar un modelo en app/models/, generar migración:
alembic revision --autogenerate -m "agregar tabla X"

# 2. Revisar el archivo generado en alembic/versions/

# 3. Aplicar la migración a la DB:
alembic upgrade head

# 4. Volver atrás una migración:
alembic downgrade -1

# 5. Ver historial:
alembic history

# 6. Ver versión actual:
alembic current
```

## Archivos

- **`env.py`** — Configura el contexto de Alembic. Lee la URL de DB
  desde `app.config.settings` y registra `Base.metadata` desde
  `app.db.base`.
- **`script.py.mako`** — Plantilla usada por Alembic para generar
  archivos de migración.
- **`versions/`** — Acá viven los archivos de migración generados.

## Configuración

La configuración general está en `backend/alembic.ini` (raíz).
