"""
progressions.py — Endpoints de progresión semanal de ángulos articulares.

Responsabilidad:
    Permitir que el kinesiólogo defina una tabla de progresión semanal
    para cada rutina asignada. Ej: "semana 1: 60-70°, semana 2: 60-80°, ..."

Endpoints planeados:
    GET    /progressions/routine/{routine_id}        — Tabla de progresión de una rutina
    POST   /progressions/routine/{routine_id}        — Agregar semana
    PUT    /progressions/routine/{routine_id}/{week} — Editar una semana
    DELETE /progressions/routine/{routine_id}/{week} — Borrar una semana
    PUT    /progressions/routine/{routine_id}/bulk   — Reemplazar todas las semanas de una

Dependencias:
    - app.schemas.progression
    - app.services.progression_service
    - app.core.dependencies (verify_routine_belongs_to_kinesiologo)

Lógica clave (progression_service):
    - Calcular la semana actual del paciente: (hoy - fecha_inicio) / 7
    - Para una semana dada, devolver la progresión correspondiente.
      Si no existe, devolver la última definida ≤ semana actual.
      Si no hay progresiones, devolver los defaults de la Routine.
"""

# TODO: from fastapi import APIRouter, Depends
# TODO: router = APIRouter()
# TODO: GET /routine/{routine_id} → lista de progresiones
# TODO: POST /routine/{routine_id} → agregar una semana
# TODO: PUT /routine/{routine_id}/{week} → editar
# TODO: DELETE /routine/{routine_id}/{week} → borrar
# TODO: PUT /routine/{routine_id}/bulk → reemplazar set completo (la UI manda la tabla entera)
