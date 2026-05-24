"""
pose.py — Schemas para el WebSocket de pose.

Schemas planeados:
    PoseFrameMessage         — Mensaje cliente → servidor
        { frame: str }  # base64 del JPEG

    PoseCorrection           — Una corrección individual
        { joint: str, message: str, severity: "info"|"improve"|"bad" }

    PoseFeedbackMessage      — Mensaje servidor → cliente
        {
          status: "perfect" | "improve" | "bad",
          corrections: List[PoseCorrection],
          angles: dict[str, float],   # ej: { "knee": 92.3, "trunk": 155.1 }
          rep_counted: bool,
          total_reps: int
        }
"""

# TODO: from pydantic import BaseModel
# TODO: from typing import Literal
# TODO: class PoseFrameMessage(BaseModel)
# TODO: class PoseCorrection(BaseModel)
# TODO: class PoseFeedbackMessage(BaseModel)
