"""
session.py — Schemas de sesiones de ejercicio.

Schemas planeados:
    SessionStart           — { patient_id } (opcional, se infiere del JWT)

    ExerciseExecutionStart — { routine_id }
    ExerciseExecutionResult
        { completed_reps, correct_reps, avg_score }

    SessionEnd             — { ended_at? } (puede ser auto-now)

    SessionResponse
        { id, started_at, ended_at, duration_minutes, adherence_pct,
          executions: List[ExerciseExecutionResponse] }

    ExerciseExecutionResponse
        { id, exercise: ExerciseResponse, target_reps, completed_reps,
          correct_reps, avg_score, effective_angle_min, effective_angle_max,
          status }

    SessionHistoryItem     — versión resumida para historial paginado

    DashboardStats
        { total_sessions, avg_adherence, total_minutes, exercises_completed }
"""

# TODO: from pydantic import BaseModel
# TODO: class SessionStart(BaseModel)
# TODO: class ExerciseExecutionStart(BaseModel)
# TODO: class ExerciseExecutionResult(BaseModel)
# TODO: class SessionEnd(BaseModel)
# TODO: class SessionResponse(BaseModel)
# TODO: class ExerciseExecutionResponse(BaseModel)
# TODO: class SessionHistoryItem(BaseModel)
# TODO: class DashboardStats(BaseModel)
