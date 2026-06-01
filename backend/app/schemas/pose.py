"""
pose.py — Schemas para el WebSocket de pose.

Define el formato de los mensajes que viajan entre el frontend
y el backend durante una sesion de ejercicio en tiempo real.
"""

from typing import Literal

from pydantic import BaseModel


class PoseCorrection(BaseModel):
    """Una correccion individual que el evaluador detecta."""
    joint: str              # "rodilla", "tronco", "cadera"
    message: str            # "Mantene el tronco mas erguido"
    severity: str           # "warning" | "error"


class PoseLandmark(BaseModel):
    """Coordenadas normalizadas (0-1) de un punto del cuerpo."""
    x: float
    y: float
    v: float  # visibility


class PoseFeedbackMessage(BaseModel):
    """
    Mensaje que el backend manda al frontend por WebSocket
    despues de procesar cada frame.

    Ejemplo:
    {
        "status": "improve",
        "corrections": [
            {"joint": "tronco", "message": "Mantene el tronco mas erguido", "severity": "warning"}
        ],
        "angles": {"knee": 92.3, "trunk": 155.1},
        "rep_counted": false,
        "total_reps": 3
    }
    """
    status: Literal["perfect", "improve", "bad"]
    corrections: list[PoseCorrection] = []
    angles: dict[str, float] = {}
    landmarks: dict[str, PoseLandmark] = {}  # índice MediaPipe → coordenada
    rep_counted: bool = False
    total_reps: int = 0
