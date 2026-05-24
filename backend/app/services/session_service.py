"""
session_service.py — Servicio de sesiones de ejercicio.

Responsabilidad:
    Manejar el ciclo de vida completo de una sesión: arranque,
    registro de ejecuciones, cierre y consulta de historial.

Funciones planeadas:

    async def start_session(patient) -> Session
        - Crea Session con status="active"

    async def start_exercise_execution(session_id, routine_id, patient)
        -> ExerciseExecution
        - Snapshot de los ángulos efectivos en ese momento
          (los guarda en la execution para auditoría)

    async def complete_exercise_execution(execution_id, result) -> ExerciseExecution
        - Registra completed_reps, correct_reps, avg_score

    async def end_session(session_id, patient) -> Session
        - Cierra la sesión
        - Calcula duración
        - Calcula adherencia (delega a adherence_service)

    async def get_patient_history(patient_id, requester, pagination) -> list

    async def get_patient_history_for_kine(patient_id, kine, pagination) -> list

Dependencias:
    - app.repositories.session_repository
    - app.services.progression_service (para snapshot de ángulos)
    - app.services.adherence_service
"""

# TODO: async def start_session(db, patient)
# TODO: async def start_exercise_execution(db, session_id, routine_id, patient)
# TODO: async def complete_exercise_execution(db, execution_id, result)
# TODO: async def end_session(db, session_id, patient)
# TODO: async def get_patient_history(db, patient_id, requester, pagination)
# TODO: async def get_patient_history_for_kine(db, patient_id, kine, pagination)
