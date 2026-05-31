"""
pose.py — Endpoint WebSocket para analisis de pose en tiempo real.

COMO FUNCIONA:
    1. El frontend abre una conexion WebSocket al arrancar un ejercicio
    2. Manda frames de la camara como base64 (~5 por segundo)
    3. El backend procesa cada frame con MediaPipe + evaluador
    4. Devuelve feedback en tiempo real (status, correcciones, angulos, reps)
    5. Cuando el paciente termina, cierra la conexion

PROTOCOLO:
    Cliente -> Servidor: { "frame": "<base64 JPEG>" }
    Servidor -> Cliente: { "status", "corrections", "angles", "rep_counted", "total_reps" }

AUTENTICACION:
    El JWT se manda como query parameter:
    ws://host/api/v1/pose/ws/42/100?token=eyJhbG...

    ¿Por que query param y no header?
    Porque el estandar WebSocket del browser no permite mandar
    headers custom en el handshake. La unica forma de pasar el
    token es en la URL o en un subprotocol.
"""

import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.security import decode_access_token
from app.pose.base_evaluator import BaseEvaluator
from app.pose.detector import PoseDetector
from app.pose.evaluators.knee_extension import KneeExtensionEvaluator
from app.pose.evaluators.squat import SquatEvaluator
from app.pose.evaluators.straight_leg_raise import StraightLegRaiseEvaluator

logger = logging.getLogger("kinova.pose")

router = APIRouter()

# Registry: mapea el evaluator_key del ejercicio a su clase evaluadora.
# Cuando Maria o Agus crean un ejercicio en la DB, le ponen un
# evaluator_key (ej: "squat") y el WebSocket sabe que clase usar.
EVALUATOR_REGISTRY: dict[str, type[BaseEvaluator]] = {
    "squat": SquatEvaluator,
    "knee_extension": KneeExtensionEvaluator,
    "straight_leg_raise": StraightLegRaiseEvaluator,
}


@router.websocket("/ws/{evaluator_key}")
async def pose_websocket(
    websocket: WebSocket,
    evaluator_key: str,
):
    """
    WebSocket para analisis de pose en tiempo real.

    Parametros de URL:
        evaluator_key: que ejercicio evaluar ("squat", "knee_extension", etc)

    Query params opcionales:
        token: JWT para autenticacion
        angle_min: angulo minimo permitido
        angle_max: angulo maximo permitido

    El flujo:
        1. Validar token (si viene)
        2. Crear el evaluador correspondiente
        3. Loop: recibir frame -> detectar pose -> evaluar -> responder
        4. Manejar desconexion
    """
    # ── Validar que el evaluator_key existe ──
    if evaluator_key not in EVALUATOR_REGISTRY:
        await websocket.close(code=4000, reason=f"Evaluador '{evaluator_key}' no existe")
        return

    # ── Autenticar (opcional en MVP, pero la estructura queda) ──
    token = websocket.query_params.get("token")
    if token:
        payload = decode_access_token(token)
        if payload is None:
            await websocket.close(code=4001, reason="Token invalido")
            return
        logger.info("WebSocket autenticado: %s", payload.get("sub"))

    # ── Leer angulos del query param ──
    angle_min = websocket.query_params.get("angle_min")
    angle_max = websocket.query_params.get("angle_max")
    angle_min = float(angle_min) if angle_min else None
    angle_max = float(angle_max) if angle_max else None

    # ── Crear evaluador y detector ──
    evaluator_class = EVALUATOR_REGISTRY[evaluator_key]
    evaluator = evaluator_class(angle_min=angle_min, angle_max=angle_max)
    detector = PoseDetector()

    # ── Aceptar la conexion ──
    await websocket.accept()
    logger.info(
        "WebSocket conectado: evaluator=%s, angle_min=%s, angle_max=%s",
        evaluator_key, angle_min, angle_max,
    )

    try:
        while True:
            # Recibir mensaje del frontend
            data = await websocket.receive_text()
            message = json.loads(data)

            frame_b64 = message.get("frame")
            if not frame_b64:
                await websocket.send_json({
                    "status": "bad",
                    "corrections": [{"joint": "sistema", "message": "Frame vacio", "severity": "error"}],
                    "angles": {},
                    "rep_counted": False,
                    "total_reps": evaluator.total_reps,
                })
                continue

            # Detectar pose con MediaPipe
            detection = detector.detect_from_base64(frame_b64)

            if detection is None:
                # No se detecto a nadie en el frame
                await websocket.send_json({
                    "status": "bad",
                    "corrections": [{"joint": "sistema", "message": "No se detecta una persona", "severity": "error"}],
                    "angles": {},
                    "rep_counted": False,
                    "total_reps": evaluator.total_reps,
                })
                continue

            # Evaluar con el evaluador del ejercicio
            result = evaluator.evaluate(detection["all_landmarks"])

            # Mandar feedback al frontend
            await websocket.send_json({
                "status": result.status,
                "corrections": result.corrections,
                "angles": result.angles,
                "rep_counted": result.rep_counted,
                "total_reps": result.total_reps,
            })

    except WebSocketDisconnect:
        logger.info(
            "WebSocket desconectado: evaluator=%s, total_reps=%d",
            evaluator_key, evaluator.total_reps,
        )
    except Exception as e:
        logger.error("Error en WebSocket: %s", str(e), exc_info=True)
        try:
            await websocket.close(code=4500, reason="Error interno")
        except Exception:
            pass
