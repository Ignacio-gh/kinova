from datetime import datetime

from pydantic import BaseModel

from app.schemas.exercise import ExerciseResponse


class SessionStart(BaseModel):
    pass


class ExerciseExecutionStart(BaseModel):
    routine_id: int


class ExerciseExecutionResult(BaseModel):
    completed_reps: int
    correct_reps: int
    avg_score: float


class SessionEnd(BaseModel):
    ended_at: datetime | None = None


class ExerciseExecutionResponse(BaseModel):
    id: int
    exercise: ExerciseResponse
    target_reps: int
    completed_reps: int | None
    correct_reps: int | None
    avg_score: float | None
    effective_angle_min: float | None
    effective_angle_max: float | None
    status: str

    model_config = {"from_attributes": True}


class SessionResponse(BaseModel):
    id: int
    started_at: datetime
    ended_at: datetime | None
    duration_minutes: int | None
    adherence_pct: float | None
    executions: list[ExerciseExecutionResponse] = []

    model_config = {"from_attributes": True}


class SessionHistoryItem(BaseModel):
    id: int
    date: datetime
    duration_minutes: int | None
    adherence_pct: float | None
    exercises_count: int

    model_config = {"from_attributes": True}


class SessionExerciseDetail(BaseModel):
    name: str
    sets: int
    reps: int
    completed: bool


class SessionHistoryDetail(BaseModel):
    id: int
    date: datetime
    duration_minutes: int | None
    adherence_pct: float | None
    exercises: list[SessionExerciseDetail]


class DashboardStats(BaseModel):
    total_sessions: int
    avg_adherence: float
    total_minutes: int
    exercises_completed: int


class KineStats(BaseModel):
    active_patients: int
    total_sessions: int
    avg_adherence: float
