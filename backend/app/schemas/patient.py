"""
patient.py — Schemas de paciente.

Schemas planeados:
    PatientCreate          — Lo que manda el kine al crear un paciente
        { full_name, email, password (auto-gen?), phone, birth_date,
          diagnosis, treatment_weeks, treatment_start_date, notes }

    PatientUpdate          — Campos opcionales para edición
    PatientStatusUpdate    — { status: "activo" | "finalizado" }

    PatientResponse        — Detalle completo del paciente
        + datos del User asociado
        + adherence_pct (calculada)
        + last_session_at (calculada)
        + current_week (calculada)

    PatientListItem        — Versión liviana para listas (lista de pacientes del kine)

    PatientDashboard       — Datos para el home del paciente
        { today_exercises, weekly_progress, upcoming, adherence }
"""

# TODO: from pydantic import BaseModel, EmailStr, Field
# TODO: from datetime import date, datetime
# TODO: class PatientCreate(BaseModel)
# TODO: class PatientUpdate(BaseModel)
# TODO: class PatientStatusUpdate(BaseModel)
# TODO: class PatientResponse(BaseModel)
# TODO: class PatientListItem(BaseModel)
# TODO: class PatientDashboard(BaseModel)
