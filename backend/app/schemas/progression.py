"""
progression.py — Schemas de progresión semanal.

Schemas planeados:
    ProgressionCreate
        { week_number, angle_min?, angle_max?, reps_override?,
          sets_override?, notes? }

    ProgressionUpdate     — campos opcionales

    ProgressionResponse
        { id, routine_id, week_number, angle_min, angle_max,
          reps_override, sets_override, notes, created_at }

    RoutineProgressionsList
        { routine_id, progressions: List[ProgressionResponse] }

    BulkProgressionsUpdate
        { progressions: List[ProgressionCreate] }
        → para reemplazar la tabla entera de una rutina

Validaciones:
    - week_number ≥ 1
    - angle_min < angle_max (si ambos definidos)
    - Idealmente week_number ≤ patient.treatment_weeks
"""

# TODO: from pydantic import BaseModel, Field
# TODO: class ProgressionCreate(BaseModel)
# TODO: class ProgressionUpdate(BaseModel)
# TODO: class ProgressionResponse(BaseModel)
# TODO: class RoutineProgressionsList(BaseModel)
# TODO: class BulkProgressionsUpdate(BaseModel)
