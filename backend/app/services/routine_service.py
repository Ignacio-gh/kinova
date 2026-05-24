"""
routine_service.py — Servicio de rutinas.

Responsabilidad:
    Asignar ejercicios, listar rutinas, obtener "ejercicios de hoy"
    y la vista semanal.

Funciones planeadas:
    async def assign_exercise(kine, data) -> RoutineResponse
        - Valida que el paciente sea del kine
        - Valida que el ejercicio exista
        - Valida que no haya duplicado en el mismo día
        - Crea Routine

    async def get_weekly_routine(patient_id, requester) -> WeeklyRoutineResponse
        - Devuelve la rutina agrupada por día de la semana

    async def get_today_routine(patient) -> list[TodayRoutineItem]
        - Toma el día actual
        - Para cada rutina, llama a progression_service para
          obtener los ángulos efectivos
        - Devuelve la lista con ángulos ya resueltos

    async def update_routine(routine_id, data, kine) -> RoutineResponse
        - Edita reps, sets, defaults

    async def delete_routine(routine_id, kine)
        - Soft delete: is_active = False

Dependencias:
    - app.repositories.routine_repository
    - app.services.progression_service
"""

# TODO: async def assign_exercise(db, kine, data)
# TODO: async def get_weekly_routine(db, patient_id, requester)
# TODO: async def get_today_routine(db, patient)
# TODO: async def update_routine(db, routine_id, data, kine)
# TODO: async def delete_routine(db, routine_id, kine)
