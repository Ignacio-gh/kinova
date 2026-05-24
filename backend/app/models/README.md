# app/models/

Modelos ORM de SQLAlchemy. Representan las tablas físicas de la base
de datos.

> 📌 **Responsable:** Agus

## Archivos

| Archivo | Tabla | Descripción |
|---|---|---|
| `base.py` | — | `DeclarativeBase` base de todos los modelos |
| `user.py` | `users` | Cuenta de usuario (email, password_hash, role) |
| `patient.py` | `patient_profiles` | Perfil del paciente (diagnóstico, fecha inicio, etc.) |
| `kinesiologo.py` | `kinesiologo_profiles` | Perfil del kine (matrícula, credencial) |
| `exercise.py` | `exercises` | Catálogo de ejercicios |
| `routine.py` | `routines` | Asignación de ejercicio a paciente |
| `progression.py` | `routine_progressions` | Progresión semanal de ángulos |
| `session.py` | `sessions` + `exercise_executions` | Sesiones realizadas |
| `feedback_log.py` | `feedback_logs` | Correcciones puntuales durante una ejecución |

## Convención

- Todos los modelos heredan de `Base` (definido en `base.py`)
- Las relaciones se declaran con `relationship()` y `ForeignKey()`
- Las columnas de timestamp usan `server_default=func.now()` para
  evitar problemas de zona horaria entre cliente y servidor

## Separación con `schemas/`

- `models/` = tablas físicas (lo que se guarda en DB)
- `schemas/` = DTOs (lo que viaja por la API)

NUNCA exponer un modelo ORM directamente en un endpoint. Siempre
mapear a un schema primero.
