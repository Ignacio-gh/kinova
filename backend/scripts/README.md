# scripts/

Scripts auxiliares ejecutables (seed de datos, creación de admin, etc.)

## Archivos

- **`seed_exercises.py`** — Carga el catálogo inicial de ejercicios en
  la DB. Se ejecuta una sola vez después de las migraciones.
- **`create_admin.py`** — Crea un usuario administrador inicial
  (kinesiólogo seed para desarrollo).
- **`run_dev.sh`** — Atajo para levantar el servidor en modo dev.

## Uso

```bash
# Con el venv activado:
python -m scripts.seed_exercises
python -m scripts.create_admin
```
