"""
routine_repository.py — Acceso a datos de Routines.

Queries planeadas:
    async def get_by_id(db, routine_id) -> Routine | None
    async def list_for_patient(db, patient_id, active_only=True) -> list[Routine]
    async def list_for_patient_by_day(db, patient_id, day_of_week) -> list[Routine]
    async def exists_for_patient_day(db, patient_id, exercise_id, day) -> bool
    async def create(db, ...) -> Routine
    async def soft_delete(db, routine_id) -> None
    async def belongs_to_kine(db, routine_id, kine_id) -> bool
"""

# TODO: from app.models.routine import Routine
# TODO: from app.repositories.base import BaseRepository
# TODO: class RoutineRepository(BaseRepository[Routine])
