"""
patient_repository.py — Acceso a datos de PatientProfile.

Queries planeadas:
    async def get_by_id(db, patient_id) -> PatientProfile | None
    async def get_by_user_id(db, user_id) -> PatientProfile | None
    async def list_by_kinesiologo(db, kine_id, filters) -> list[PatientProfile]
        - filtros: status (activo|finalizado), search (por nombre/diagnóstico)
    async def count_by_kinesiologo(db, kine_id, status=None) -> int
    async def create(db, user_id, kine_id, ...) -> PatientProfile
    async def update_status(db, patient_id, status) -> PatientProfile
    async def belongs_to_kine(db, patient_id, kine_id) -> bool
"""

# TODO: from app.models.patient import PatientProfile
# TODO: from app.repositories.base import BaseRepository
# TODO: class PatientRepository(BaseRepository[PatientProfile])
