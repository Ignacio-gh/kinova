"""
exercises.py — Endpoints del catálogo de ejercicios.

Responsabilidad:
    Exponer el catálogo de ejercicios (read-only para el MVP).
    El catálogo se carga inicialmente con un seed en `scripts/seed_exercises.py`.

Endpoints planeados:
    GET    /exercises/                   — Lista del catálogo (filtros: zona, búsqueda)
    GET    /exercises/{id}               — Detalle de un ejercicio

Dependencias:
    - app.schemas.exercise
    - app.services.exercise_service
    - app.core.dependencies (get_current_user)

Nota:
    Para el MVP no se permite que el kine cree ejercicios desde la app.
    Es un catálogo controlado, curado por el equipo.
"""

# TODO: from fastapi import APIRouter, Depends, Query
# TODO: router = APIRouter()
# TODO: GET / con filtros (zone, search) → exercise_service.list
# TODO: GET /{id} → exercise_service.get
