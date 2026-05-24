# app/utils/

Utilidades **genéricas**. Helpers sin contexto de dominio.

> Diferencia con `core/`: `core/` es para piezas con lógica de aplicación
> (auth, permisos). `utils/` es para helpers neutros (formatear fechas,
> validar strings).

## Archivos

- **`datetime.py`** — Helpers para manejo de fechas y semanas
  (calcular semana de tratamiento, formatear fechas, etc.)
- **`validators.py`** — Validadores reutilizables (email, matrícula,
  rangos de ángulos válidos, etc.)
