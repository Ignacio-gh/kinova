# app/repositories/

**Capa de acceso a datos.** Encapsula las queries de SQLAlchemy.

## ¿Por qué?

Sin esta capa, los services terminarían llenos de queries SQLAlchemy
embebidas. El patrón Repository las centraliza por entidad:

```
patient_service.update_status() → patient_repository.update(...)
```

## Qué hace un repository

- Define métodos como `get_by_id`, `list`, `create`, `update`, `delete`
- Define queries específicas como `get_active_patients_of_kine`,
  `count_completed_executions_this_week`, etc.
- Trabaja con modelos ORM y devuelve modelos ORM
- **No conoce schemas Pydantic** — eso es responsabilidad del service

## Beneficios

- **Tests más fáciles:** se puede mockear el repository en tests del service
- **Queries reutilizadas:** una vez optimizada una query, todos la usan
- **Centralización:** si cambiás de SQLAlchemy a otro ORM, solo cambia
  esta capa

## Archivos

| Archivo | Maneja |
|---|---|
| `base.py` | Clase base genérica con CRUD común |
| `user_repository.py` | Users |
| `patient_repository.py` | PatientProfiles + queries del kine |
| `kinesiologo_repository.py` | KinesiologoProfiles |
| `exercise_repository.py` | Exercise catalog |
| `routine_repository.py` | Routines + queries por paciente/día |
| `progression_repository.py` | RoutineProgressions con queries de fallback |
| `session_repository.py` | Sessions + ExerciseExecutions + FeedbackLogs |
