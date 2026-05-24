# app/db/

Infraestructura de conexión a la base de datos.

> 📌 **Responsable:** Agus

## Archivos

- **`base.py`** — Re-exporta la `Base` de SQLAlchemy (definida en
  `app/models/base.py`). Importa también todos los modelos para que
  Alembic los detecte.
- **`session.py`** — Engine asíncrono + session factory + dependency
  `get_db()` que se inyecta en los endpoints.

## Flujo

```
config/settings.py (lee DATABASE_URL del .env)
        │
        ▼
db/session.py (crea engine y session factory)
        │
        ▼
core/dependencies.get_db() (provee AsyncSession a cada request)
        │
        ▼
repositories/* (usan la sesión para queries)
```
