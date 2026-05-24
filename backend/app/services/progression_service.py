"""
progression_service.py — Servicio de progresión semanal de ángulos.

🔑 ESTE ES UNO DE LOS SERVICIOS CLAVE DEL SISTEMA.

Responsabilidad:
    1. Calcular en qué semana del tratamiento está un paciente.
    2. Dado un paciente y una rutina, devolver los ángulos EFECTIVOS
       a aplicar hoy (según la progresión definida por el kinesiólogo).
    3. CRUD de progresiones (lado kine).

Funciones planeadas:

    def calculate_current_week(patient: PatientProfile) -> int:
        return (today - patient.treatment_start_date).days // 7 + 1

    async def get_effective_angles(
        db, patient, routine
    ) -> tuple[float | None, float | None]:
        '''
        Algoritmo:
        1. week = calculate_current_week(patient)
        2. Buscar RoutineProgression(routine_id, week_number=week)
        3. Si existe, devolver sus ángulos
        4. Si no existe, buscar la última con week_number < week
           y devolver sus ángulos
        5. Si no hay progresiones, devolver Routine.default_angle_min/max
        '''

    async def list_progressions(routine_id, kine) -> list[ProgressionResponse]

    async def create_progression(routine_id, data, kine) -> ProgressionResponse
        - Valida week_number único para esa rutina
        - Valida week_number ≤ patient.treatment_weeks (warning?)

    async def update_progression(progression_id, data, kine)

    async def delete_progression(progression_id, kine)

    async def bulk_update_progressions(routine_id, progressions, kine)
        - Reemplaza el set completo en una transacción
        - Útil para que la UI mande la tabla entera de una

Dependencias:
    - app.repositories.progression_repository
    - app.repositories.routine_repository

Rol arquitectónico:
    Servicio crítico. Lo consumen:
    - routine_service (al armar la rutina de hoy)
    - pose_service (al inicializar el evaluador con los ángulos correctos)
    - El endpoint del WebSocket
"""

# TODO: def calculate_current_week(patient)
# TODO: async def get_effective_angles(db, patient, routine)
# TODO: async def list_progressions(db, routine_id, kine)
# TODO: async def create_progression(db, routine_id, data, kine)
# TODO: async def update_progression(db, progression_id, data, kine)
# TODO: async def delete_progression(db, progression_id, kine)
# TODO: async def bulk_update_progressions(db, routine_id, progressions, kine)
