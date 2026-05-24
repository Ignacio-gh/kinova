"""
routine.py — Schemas de rutinas (asignación de ejercicios).

Schemas planeados:
    RoutineCreate
        { patient_id, exercise_id, day_of_week, reps, sets,
          default_angle_min?, default_angle_max? }

    RoutineUpdate         — campos opcionales

    RoutineResponse       — Incluye el ejercicio embebido (no solo el id)
        { id, exercise: ExerciseResponse, day, reps, sets, defaults }

    WeeklyRoutineResponse — dict { monday: [RoutineResponse], tuesday: [...], ... }

    TodayRoutineItem      — La rutina de hoy con ángulos efectivos ya calculados
        {
          routine_id, exercise: ExerciseResponse,
          reps, sets,
          effective_angle_min, effective_angle_max,
          current_week
        }
        → Este lo consume el frontend para mostrar el ejercicio del día.
          El backend ya hizo el cálculo de qué semana es y qué progresión aplica.
"""

# TODO: from pydantic import BaseModel
# TODO: class RoutineCreate(BaseModel)
# TODO: class RoutineUpdate(BaseModel)
# TODO: class RoutineResponse(BaseModel)
# TODO: class WeeklyRoutineResponse(BaseModel)
# TODO: class TodayRoutineItem(BaseModel)
