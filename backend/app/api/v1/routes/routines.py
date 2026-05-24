"""
routines.py — Endpoints de rutinas (asignaciones de ejercicios).

Responsabilidad:
    Permitir que el kinesiólogo asigne ejercicios a sus pacientes
    para días específicos de la semana.

Endpoints planeados:
    GET    /routines/patient/{patient_id}    — Rutina semanal completa de un paciente
    POST   /routines/                        — Asignar ejercicio (kine)
    PUT    /routines/{id}                    — Editar asignación
    DELETE /routines/{id}                    — Eliminar (soft delete)
    GET    /routines/me/today                — Ejercicios de hoy del paciente logueado
    GET    /routines/me/week                 — Vista semanal del paciente logueado

Dependencias:
    - app.schemas.routine
    - app.services.routine_service
    - app.services.progression_service (para calcular ángulos efectivos)
    - app.core.dependencies

Importante:
    Los endpoints "/me/today" y "/me/week" devuelven los ángulos EFECTIVOS
    según la semana actual del tratamiento del paciente (calculados por
    progression_service).
"""

# TODO: from fastapi import APIRouter, Depends
# TODO: router = APIRouter()
# TODO: GET /patient/{patient_id} → rutina agrupada por día de la semana
# TODO: POST / → asignar ejercicio (validar día, evitar duplicados)
# TODO: PUT /{id} → editar reps/sets/ángulos default
# TODO: DELETE /{id} → soft delete (is_active = False)
# TODO: GET /me/today → ejercicios del día con ángulos efectivos
# TODO: GET /me/week → vista semanal completa
