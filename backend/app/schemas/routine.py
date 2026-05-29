from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.exercise import ExerciseResponse

DayOfWeek = Literal[
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
]


class RoutineCreate(BaseModel):
    patient_id: int
    exercise_id: int
    day_of_week: DayOfWeek
    reps: int = Field(ge=1)
    sets: int = Field(ge=1)
    default_angle_min: float | None = None
    default_angle_max: float | None = None


class RoutineUpdate(BaseModel):
    reps: int | None = Field(None, ge=1)
    sets: int | None = Field(None, ge=1)
    default_angle_min: float | None = None
    default_angle_max: float | None = None


class RoutineResponse(BaseModel):
    id: int
    patient_id: int
    exercise: ExerciseResponse
    day_of_week: str
    reps: int
    sets: int
    default_angle_min: float | None
    default_angle_max: float | None
    is_active: bool

    model_config = {"from_attributes": True}


class WeeklyRoutineResponse(BaseModel):
    monday: list[RoutineResponse] = []
    tuesday: list[RoutineResponse] = []
    wednesday: list[RoutineResponse] = []
    thursday: list[RoutineResponse] = []
    friday: list[RoutineResponse] = []
    saturday: list[RoutineResponse] = []
    sunday: list[RoutineResponse] = []


class TodayRoutineItem(BaseModel):
    routine_id: int
    exercise: ExerciseResponse
    reps: int
    sets: int
    effective_angle_min: float | None
    effective_angle_max: float | None
    current_week: int
