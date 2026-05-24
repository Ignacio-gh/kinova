"""
adherence_service.py — Cálculo de adherencia.

Responsabilidad:
    Calcular qué tan bien sigue el paciente su rutina.
    Es la métrica clave del producto.

Funciones planeadas:

    async def calculate_weekly_adherence(patient, week_offset=0) -> float
        '''
        Para una semana dada:
        - Cuenta ejercicios asignados (Routines activas de esa semana)
        - Cuenta ejercicios completados (ExerciseExecution status=completed)
        - Devuelve % = completed / assigned * 100
        '''

    async def calculate_session_adherence(session) -> float
        '''
        Para una sesión específica:
        - assigned = cantidad de ejercicios que tenía que hacer ese día
        - completed = cantidad de ExerciseExecution completados en la sesión
        '''

    async def calculate_avg_adherence_for_kine(kine) -> float
        '''
        Promedio de adherencia de los pacientes activos del kine.
        Usado en su dashboard.
        '''

    async def get_dashboard_stats(patient) -> DashboardStats
        '''
        { total_sessions, avg_adherence, total_minutes, exercises_completed }
        '''

Dependencias:
    - app.repositories.session_repository
    - app.repositories.routine_repository
    - app.repositories.patient_repository

Rol arquitectónico:
    Servicio separado porque lo consumen MUCHOS endpoints:
    - dashboard del paciente
    - dashboard del kine
    - lista de pacientes (cada item muestra %)
    - cierre de sesión (calcula adherencia de esa sesión)
"""

# TODO: async def calculate_weekly_adherence(db, patient, week_offset=0)
# TODO: async def calculate_session_adherence(db, session)
# TODO: async def calculate_avg_adherence_for_kine(db, kine)
# TODO: async def get_dashboard_stats(db, patient)
