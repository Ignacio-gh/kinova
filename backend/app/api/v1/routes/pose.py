"""
pose.py — Endpoint WebSocket de análisis de pose en tiempo real.

Responsabilidad:
    Aceptar conexiones WebSocket desde el frontend durante una sesión
    activa. Recibir frames (base64), pasarlos por el motor de pose,
    y devolver feedback en tiempo real.

Endpoint planeado:
    WS     /pose/ws/{session_id}/{execution_id}

Protocolo:
    Cliente → Servidor:
        { "frame": "<base64 del JPEG>" }

    Servidor → Cliente:
        {
          "status": "perfect" | "improve" | "bad",
          "corrections": [
              { "joint": "rodilla", "message": "...", "severity": "..." }
          ],
          "angles": { "knee": 92.3, "trunk": 155.1 },
          "rep_counted": true,
          "total_reps": 5
        }

Dependencias:
    - app.schemas.pose
    - app.services.pose_service (orquesta detector + evaluador)
    - app.services.session_service (para actualizar contadores en DB)
    - app.core.dependencies

Notas técnicas:
    - Frecuencia esperada: ~5 frames/segundo
    - El WebSocket se mantiene abierto durante toda la ejecución de un ejercicio
    - Si se cierra abruptamente, el ejercicio queda como "abandonado"
"""

# TODO: from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
# TODO: router = APIRouter()
# TODO: @router.websocket("/ws/{session_id}/{execution_id}")
# TODO: Autenticar la conexión (JWT en query param o subprotocol)
# TODO: Cargar evaluador correspondiente al ejercicio
# TODO: Loop: recibir frame → procesar → enviar feedback
# TODO: Manejar disconnect para cerrar ejecución correctamente
