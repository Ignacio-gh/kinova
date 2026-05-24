# app/schemas/

Schemas de Pydantic. Definen los **contratos de la API**: lo que entra
y lo que sale en cada endpoint.

## ¿Por qué existen separados de `models/`?

| `models/` (ORM) | `schemas/` (Pydantic) |
|---|---|
| Lo que se guarda en DB | Lo que viaja por la API |
| Incluye `password_hash`, `created_at`, internals | Solo campos que el cliente debe ver |
| Sirve para queries | Sirve para validación y documentación |
| Está acoplado a SQLAlchemy | Independiente del ORM |

**Regla:** los endpoints SIEMPRE reciben y devuelven schemas. Nunca
exponer un modelo ORM directamente.

## Patrón de naming

Para cada entidad usualmente se definen 3 schemas:

- `<Entity>Create` — Input para crear (sin id, sin timestamps)
- `<Entity>Update` — Input para actualizar (todos los campos opcionales)
- `<Entity>Response` — Output (con id, timestamps, campos derivados)

## Archivos

| Archivo | Schemas |
|---|---|
| `auth.py` | LoginRequest, LoginResponse, RegisterPatientRequest, RegisterKinesiologoRequest |
| `user.py` | UserBase, UserResponse |
| `patient.py` | PatientCreate, PatientUpdate, PatientResponse, PatientListItem, PatientStatusUpdate |
| `kinesiologo.py` | KinesiologoResponse, KinesiologoUpdate |
| `exercise.py` | ExerciseResponse, ExerciseListItem |
| `routine.py` | RoutineCreate, RoutineUpdate, RoutineResponse, WeeklyRoutineResponse, TodayRoutineItem |
| `progression.py` | ProgressionCreate, ProgressionUpdate, ProgressionResponse |
| `session.py` | SessionStart, SessionEnd, ExerciseExecutionResult, SessionHistoryItem, DashboardStats |
| `pose.py` | PoseFrameMessage, PoseFeedbackMessage, PoseCorrection |
