from datetime import datetime

from pydantic import BaseModel, Field, model_validator


class ProgressionCreate(BaseModel):
    week_number: int = Field(ge=1)
    angle_min: float | None = None
    angle_max: float | None = None
    reps_override: int | None = None
    sets_override: int | None = None
    notes: str | None = None

    @model_validator(mode="after")
    def validate_angles(self):
        if self.angle_min is not None and self.angle_max is not None:
            if self.angle_min >= self.angle_max:
                raise ValueError("angle_min debe ser menor que angle_max")
        return self


class ProgressionUpdate(BaseModel):
    angle_min: float | None = None
    angle_max: float | None = None
    reps_override: int | None = None
    sets_override: int | None = None
    notes: str | None = None

    @model_validator(mode="after")
    def validate_angles(self):
        if self.angle_min is not None and self.angle_max is not None:
            if self.angle_min >= self.angle_max:
                raise ValueError("angle_min debe ser menor que angle_max")
        return self


class ProgressionResponse(BaseModel):
    id: int
    routine_id: int
    week_number: int
    angle_min: float | None
    angle_max: float | None
    reps_override: int | None
    sets_override: int | None
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class RoutineProgressionsList(BaseModel):
    routine_id: int
    progressions: list[ProgressionResponse]


class BulkProgressionsUpdate(BaseModel):
    progressions: list[ProgressionCreate]
