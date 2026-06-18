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

logger = logging.getLogger("kinova.pose")

router = APIRouter()

SKELETON_LANDMARK_INDICES = [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]

EVALUATOR_REGISTRY: dict[str, type[BaseEvaluator]] = {
    "squat": SquatEvaluator,
    "knee_extension": KneeExtensionEvaluator,
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

    # ── Buffer de suavizado temporal (EMA) ──
    # Cada landmark nuevo se mezcla con su valor previo para evitar saltos
    # bruscos cuando MediaPipe duda entre frames. alpha=0.55 ⇒ ~55% del frame
    # actual + 45% del histórico. Más bajo = más suave pero más perezoso.
    # MAX_JUMP rechaza saltos grandes (típicamente "se cambió de pierna")
    # y los reemplaza por el valor suavizado anterior — efectivamente
    # ignora un frame outlier.
    smoothed_landmarks: dict[int, dict[str, float]] = {}
    SMOOTH_ALPHA = 0.70  # balance suavidad/respuesta para ejercicios en perfil
    MAX_JUMP = 0.35  # rechaza teleportaciones pero permite movimientos de ejercicio
    no_detection_frames = 0  # frames consecutivos sin detección
    NO_DETECTION_RESET = 3   # tras 3 frames sin nadie → resetear EMA (balance entre limpieza y estabilidad)

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
                no_detection_frames += 1
                if no_detection_frames >= NO_DETECTION_RESET:
                    smoothed_landmarks.clear()
                await websocket.send_json({
                    "status": "bad",
                    "corrections": [{"joint": "sistema", "message": "No se detecta una persona", "severity": "error"}],
                    "angles": {},
                    "rep_counted": False,
                    "total_reps": evaluator.total_reps,
                })
                continue

            no_detection_frames = 0

            # ── Aplicar EMA + rechazo de saltos a TODOS los landmarks ──
            # Esto evita que el esqueleto tiemble o "se cambie de pierna"
            # cuando MediaPipe duda entre frames.
            raw_landmarks = detection["all_landmarks"]
            for idx in range(len(raw_landmarks)):
                rx = float(raw_landmarks[idx].x)
                ry = float(raw_landmarks[idx].y)
                rv = float(raw_landmarks[idx].visibility or 0.0)

                prev = smoothed_landmarks.get(idx)
                if prev is None:
                    # Primer frame: usar el valor crudo
                    smoothed_landmarks[idx] = {"x": rx, "y": ry, "v": rv}
                else:
                    dv = rv - prev["v"]
                    dx = abs(rx - prev["x"])
                    dy = abs(ry - prev["y"])

                    if (dx > MAX_JUMP or dy > MAX_JUMP) and not (rv > 0.4 and prev["v"] > 0.4):
                        # Salto grande con baja confianza → probable outlier, ignorar.
                        # Solo se acepta el salto si ambos frames tienen visibilidad alta,
                        # lo que indica que el paciente se movió rápido pero MediaPipe
                        # está seguro en ambos frames.
                        continue
                    else:
                        # EMA estándar — suaviza sin snapear.
                        smoothed_landmarks[idx] = {
                            "x": SMOOTH_ALPHA * rx + (1 - SMOOTH_ALPHA) * prev["x"],
                            "y": SMOOTH_ALPHA * ry + (1 - SMOOTH_ALPHA) * prev["y"],
                            "v": SMOOTH_ALPHA * rv + (1 - SMOOTH_ALPHA) * prev["v"],
                        }

            # ── Construir una vista "tipo MediaPipe" con valores suavizados ──
            # para que los evaluadores existentes funcionen sin cambios.
            class _SmoothLM:
                __slots__ = ("x", "y", "visibility")
                def __init__(self, x: float, y: float, v: float) -> None:
                    self.x = x
                    self.y = y
                    self.visibility = v

            smoothed_list = [
                _SmoothLM(
                    smoothed_landmarks[i]["x"],
                    smoothed_landmarks[i]["y"],
                    smoothed_landmarks[i]["v"],
                )
                for i in range(len(raw_landmarks))
            ]

            # Evaluar con landmarks suavizados — más estables → menos falsos positivos
            result = evaluator.evaluate(smoothed_list)

            # Display: usar landmarks suavizados (EMA) para un skeleton estable.
            # Los crudos de MediaPipe son ruidosos frame a frame.
            landmarks_payload = {
                str(idx): {
                    "x": round(float(smoothed_landmarks[idx]["x"]), 4),
                    "y": round(float(smoothed_landmarks[idx]["y"]), 4),
                    "v": round(float(smoothed_landmarks[idx]["v"]), 2),
                }
                for idx in SKELETON_LANDMARK_INDICES
                if idx in smoothed_landmarks
            }

            # Mandar feedback al frontend
            await websocket.send_json({
                "status": result.status,
                "corrections": result.corrections,
                "angles": result.angles,
                "landmarks": landmarks_payload,
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
