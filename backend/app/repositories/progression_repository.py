"""
progression_repository.py — Acceso a datos de RoutineProgressions.

Queries planeadas:
    async def list_by_routine(db, routine_id) -> list[RoutineProgression]
        - Ordenadas por week_number ASC

    async def get_for_week(db, routine_id, week_number) -> RoutineProgression | None

    async def get_latest_before_or_equal(db, routine_id, week_number) -> RoutineProgression | None
        '''
        Devuelve la progresión cuya week_number es la mayor que sea ≤ week_number.
        Es la query CLAVE para la lógica de fallback de ángulos efectivos.
        '''

    async def upsert(db, routine_id, week_number, ...) -> RoutineProgression
    async def delete_by_routine_and_week(db, routine_id, week_number) -> None
    async def replace_all_for_routine(db, routine_id, progressions: list) -> None
"""

# TODO: from app.models.progression import RoutineProgression
# TODO: from app.repositories.base import BaseRepository
# TODO: class ProgressionRepository(BaseRepository[RoutineProgression])
