from pydantic import BaseModel


class ExerciseResponse(BaseModel):
    id: int
    name: str
    zone: str
    description: str | None = None
    steps: list[str] = []
    benefits: list[str] = []
    image_url: str | None = None
    video_url: str | None = None
    evaluator_key: str | None = None

    model_config = {"from_attributes": True}


class ExerciseListItem(BaseModel):
    id: int
    name: str
    zone: str
    image_url: str | None = None

    model_config = {"from_attributes": True}
