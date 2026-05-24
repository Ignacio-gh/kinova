# app/core/

Componentes transversales del backend que son usados por múltiples capas.

## Archivos

- **`security.py`** — Hashing de passwords (bcrypt), generación y
  verificación de tokens JWT.
- **`dependencies.py`** — Dependencias inyectables de FastAPI
  (`get_current_user`, `get_current_patient`, `get_current_kinesiologo`,
  `verify_patient_belongs_to_kine`, etc.)
- **`exceptions.py`** — Excepciones custom del dominio
  (`PatientNotFoundError`, `UnauthorizedError`, `InvalidProgressionError`...)

## Por qué `core` y no `utils`

`core` es para piezas con **lógica de aplicación** (cómo se autentica un
usuario, qué permisos tiene). `utils/` es para helpers genéricos sin
contexto de dominio (formatear fechas, validar emails).
