"""
kinesiologo_repository.py — Acceso a datos de KinesiologoProfile.

Queries planeadas:
    async def get_by_id(db, kine_id) -> KinesiologoProfile | None
    async def get_by_user_id(db, user_id) -> KinesiologoProfile | None
    async def get_by_matricula(db, matricula) -> KinesiologoProfile | None
    async def create(db, user_id, matricula, ...) -> KinesiologoProfile
"""

# TODO: from app.models.kinesiologo import KinesiologoProfile
# TODO: from app.repositories.base import BaseRepository
# TODO: class KinesiologoRepository(BaseRepository[KinesiologoProfile])
