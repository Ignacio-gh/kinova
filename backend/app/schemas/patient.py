from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserResponse


class PatientCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    birth_date: date | None = None
    diagnosis: str
    treatment_weeks: int = Field(ge=1)
    treatment_start_date: date
    notes: str | None = None


class PatientUpdate(BaseModel):
    phone: str | None = None
    birth_date: date | None = None
    diagnosis: str | None = None
    treatment_weeks: int | None = Field(None, ge=1)
    treatment_start_date: date | None = None
    notes: str | None = None


class PatientStatusUpdate(BaseModel):
    status: Literal["activo", "finalizado"]


class PatientResponse(BaseModel):
    id: int
    user: UserResponse
    kinesiologo_id: int
    phone: str | None
    birth_date: date | None
    diagnosis: str
    notes: str | None
    treatment_weeks: int
    treatment_start_date: date
    status: str
    current_week: int
    adherence_pct: float | None = None
    last_session_at: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class PatientListItem(BaseModel):
    id: int
    full_name: str
    email: str
    diagnosis: str
    status: str
    current_week: int
    treatment_weeks: int
    adherence_pct: float | None = None
    last_session_at: datetime | None = None

    model_config = {"from_attributes": True}


class TodayExerciseItem(BaseModel):
    routine_id: int
    name: str
    reps: int
    sets: int
    effective_angle_min: float | None
    effective_angle_max: float | None


class PatientDashboard(BaseModel):
    today_exercises: list[TodayExerciseItem]
    adherence_pct: float
    current_week: int
    treatment_weeks: int
