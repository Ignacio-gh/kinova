"""
session_repository.py — Acceso a datos de Sessions, ExerciseExecutions, FeedbackLogs.

Queries planeadas (Session):
    async def get_by_id(db, session_id) -> Session | None
    async def list_for_patient(db, patient_id, pagination) -> list[Session]
    async def get_active_for_patient(db, patient_id) -> Session | None
    async def create(db, patient_id) -> Session
    async def close(db, session_id, ended_at, adherence_pct) -> Session

Queries planeadas (ExerciseExecution):
    async def create_execution(db, session_id, routine_id, target_reps, angles) -> ExerciseExecution
    async def complete_execution(db, exec_id, completed_reps, correct_reps, score)
    async def list_for_session(db, session_id) -> list[ExerciseExecution]
    async def count_completed_for_week(db, patient_id, week_start) -> int

Queries planeadas (FeedbackLog):
    async def log_feedback(db, execution_id, correction_type, message, severity, angles)
    async def list_for_execution(db, execution_id) -> list[FeedbackLog]
"""

# TODO: from app.models.session import Session, ExerciseExecution
# TODO: from app.models.feedback_log import FeedbackLog
# TODO: from app.repositories.base import BaseRepository
# TODO: class SessionRepository(BaseRepository[Session])
# TODO: class ExerciseExecutionRepository(BaseRepository[ExerciseExecution])
# TODO: class FeedbackLogRepository(BaseRepository[FeedbackLog])
