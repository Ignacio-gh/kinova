"""
kinesiologo_service.py — Servicio del kinesiólogo.

Responsabilidad:
    Casos de uso "yo-céntricos" del kinesiólogo.

Funciones planeadas:
    async def get_dashboard(kine) -> KinesiologoDashboard
        - Total de pacientes (activos / finalizados)
        - Adherencia promedio de sus pacientes activos
        - Sesiones recientes de sus pacientes

    async def update_profile(kine, data) -> KinesiologoResponse
        - Editar matricula, especialidad, etc.

Dependencias:
    - app.repositories.kinesiologo_repository
    - app.services.adherence_service
"""

# TODO: async def get_dashboard(db, kine)
# TODO: async def update_profile(db, kine, data)
