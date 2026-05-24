"""
patient_service.py — Servicio de gestión de pacientes.

Responsabilidad:
    Casos de uso del CRUD de pacientes desde la perspectiva del kine
    y del paciente mismo.

Funciones planeadas:
    async def list_for_kinesiologo(kine, filters) -> list[PatientListItem]
        - Devuelve pacientes del kine con filtros (status, search)
        - Incluye adherencia calculada por adherence_service

    async def create_patient(kine, data) -> PatientResponse
        - Valida email único
        - Crea User + PatientProfile asociado al kine

    async def get_patient_detail(patient_id, kine) -> PatientResponse
        - Verifica pertenencia
        - Incluye adherencia y última sesión

    async def update_patient(patient_id, data, kine) -> PatientResponse
        - Edita notas, diagnóstico, semanas de tratamiento

    async def update_status(patient_id, status, kine) -> PatientResponse
        - Cambia entre "activo" y "finalizado"
        - Si pasa a finalizado: desactiva rutinas activas

    async def get_dashboard(patient) -> PatientDashboard
        - Ejercicios de hoy + adherencia + próximos + progreso semanal

Dependencias:
    - app.repositories.patient_repository
    - app.repositories.user_repository
    - app.services.adherence_service
    - app.services.routine_service
"""

# TODO: async def list_for_kinesiologo(db, kine, filters)
# TODO: async def create_patient(db, kine, data)
# TODO: async def get_patient_detail(db, patient_id, kine)
# TODO: async def update_patient(db, patient_id, data, kine)
# TODO: async def update_status(db, patient_id, status, kine)
# TODO: async def get_dashboard(db, patient)
