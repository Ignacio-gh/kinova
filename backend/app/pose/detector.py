"""
detector.py — Wrapper de MediaPipe Pose.

QUE HACE ESTE ARCHIVO:
    Envuelve a MediaPipe Pose en una clase simple. Recibe una imagen
    (como bytes o como array de numpy) y devuelve los landmarks
    (puntos del cuerpo) detectados.

QUE ES MEDIAPIPE:
    Es una libreria de Google que detecta 33 puntos del cuerpo humano
    en una imagen. Le das una foto y te devuelve las coordenadas (x, y)
    de la cabeza, hombros, codos, muñecas, caderas, rodillas, tobillos, etc.

    Cada punto tiene:
    - x: posicion horizontal (0.0 = borde izquierdo, 1.0 = borde derecho)
    - y: posicion vertical (0.0 = arriba, 1.0 = abajo)
    - visibility: que tan seguro esta de que ese punto es visible (0.0 a 1.0)

    Los valores x,y son NORMALIZADOS (porcentajes de la imagen),
    no pixeles. Asi funciona igual con cualquier resolucion.

QUE ES UN SINGLETON:
    Un singleton es un objeto del que solo existe UNA instancia.
    MediaPipe Pose tarda en inicializarse (~1 segundo) porque carga
    un modelo de inteligencia artificial. Si lo crearamos de nuevo
    en cada frame, el sistema seria lentisimo.

    Con el singleton, se crea UNA vez y se reutiliza en todos los
    frames. Es como encender la cocina una sola vez al abrir el
    restaurante, no cada vez que llega un pedido.

LOS 4 LANDMARKS QUE NOS IMPORTAN (por lado):
    Para rodilla necesitamos:
    - Shoulder (hombro):  landmarks 11 (izq) / 12 (der)
    - Hip (cadera):       landmarks 23 (izq) / 24 (der)
    - Knee (rodilla):     landmarks 25 (izq) / 26 (der)
    - Ankle (tobillo):    landmarks 27 (izq) / 28 (der)

    Como la camara es LATERAL (de costado), usamos siempre
    los landmarks del lado visible.

COMO SE USA:
    from app.pose.detector import PoseDetector

    detector = PoseDetector()

    # Con bytes de una imagen (como llega del WebSocket)
    landmarks = detector.detect_from_bytes(image_bytes)

    # Con un array de numpy (como llega de OpenCV)
    landmarks = detector.detect_from_array(image_array)

    if landmarks is not None:
        knee = landmarks["knee"]  # (x, y, visibility)
"""

import base64
import io
from typing import Any

import cv2
import mediapipe as mp
import numpy as np
from PIL import Image, ImageOps

from app.config.settings import settings


# ── INDICES DE LANDMARKS DE MEDIAPIPE ─────────────────────────
# MediaPipe Pose tiene 33 landmarks. Estos son los que usamos.
# Referencia completa: https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker

# Lado izquierdo (el que ve la camara cuando el paciente mira a la derecha)
LEFT_LANDMARKS = {
    "shoulder": 11,
    "hip": 23,
    "knee": 25,
    "ankle": 27,
}

# Lado derecho (el que ve la camara cuando el paciente mira a la izquierda)
RIGHT_LANDMARKS = {
    "shoulder": 12,
    "hip": 24,
    "knee": 26,
    "ankle": 28,
}


class PoseDetector:
    """
    Wrapper singleton de MediaPipe Pose.

    Encapsula la inicializacion y el procesamiento de MediaPipe
    en una interfaz simple para el resto de la app.
    """

    # Variable de clase para el singleton
    _instance: "PoseDetector | None" = None

    def __new__(cls) -> "PoseDetector":
        """
        Singleton: si ya existe una instancia, la devuelve.
        Si no, crea una nueva. Asi MediaPipe se inicializa una sola vez.
        """
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        """
        Inicializa MediaPipe Pose (solo la primera vez).

        Parametros de MediaPipe:
        - static_image_mode=False: estamos procesando VIDEO (frames
          consecutivos), no fotos sueltas. Esto le permite a MediaPipe
          trackear entre frames, lo que es mas rapido y estable.
        - model_complexity: 0=rapido, 1=balanceado, 2=preciso.
          Viene del .env (POSE_MODEL_COMPLEXITY).
        - min_detection_confidence: confianza minima para detectar
          una persona. Viene del .env (POSE_CONFIDENCE_THRESHOLD).
        - min_tracking_confidence: confianza minima para seguir
          trackeando entre frames. Si baja de esto, re-detecta.
        """
        if self._initialized:
            return

        self._mp_pose = mp.solutions.pose
        self._pose = self._mp_pose.Pose(
            static_image_mode=False,
            model_complexity=settings.POSE_MODEL_COMPLEXITY,
            min_detection_confidence=settings.POSE_CONFIDENCE_THRESHOLD,
            min_tracking_confidence=settings.POSE_CONFIDENCE_THRESHOLD,
        )
        self._initialized = True

    def detect_from_bytes(self, image_bytes: bytes) -> dict[str, Any] | None:
        """
        Recibe bytes de una imagen y devuelve los landmarks.

        Usa PIL para respetar el EXIF de orientación — en Android,
        las fotos tomadas en modo retrato llegan rotadas 90° en los
        bytes pero con un tag EXIF que dice "rotar 90°". OpenCV
        ignora ese tag; PIL lo aplica automáticamente con exif_transpose.
        Sin este paso, MediaPipe ve a la persona de costado y no detecta
        la pose.
        """
        try:
            pil_img = Image.open(io.BytesIO(image_bytes))
            pil_img = ImageOps.exif_transpose(pil_img)   # aplica rotación EXIF
            if pil_img.mode != "RGB":
                pil_img = pil_img.convert("RGB")
            image = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        except Exception:
            # Fallback si PIL falla por alguna razón
            np_array = np.frombuffer(image_bytes, dtype=np.uint8)
            image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if image is None:
            return None

        # Reducir a máximo 480px en el lado largo para acelerar MediaPipe.
        # Con frames de móvil que vienen ya pequeños (~360x640 a quality 0.15),
        # esto suele no aplicar — pero es safety net para frames grandes.
        h, w = image.shape[:2]
        if max(h, w) > 480:
            scale = 480 / max(h, w)
            image = cv2.resize(image, (int(w * scale), int(h * scale)))

        return self.detect_from_array(image)

    def detect_from_base64(self, base64_string: str) -> dict[str, Any] | None:
        """
        Recibe un string base64 de una imagen y devuelve los landmarks.
        Es lo que llega del frontend por WebSocket.

        Parametros:
            base64_string: la imagen codificada en base64
                          (puede incluir o no el prefijo "data:image/...")
        """
        # Sacar el prefijo "data:image/jpeg;base64," si viene
        if "," in base64_string:
            base64_string = base64_string.split(",", 1)[1]

        image_bytes = base64.b64decode(base64_string)
        return self.detect_from_bytes(image_bytes)

    def detect_from_array(self, image: np.ndarray) -> dict[str, Any] | None:
        """
        Recibe un array de numpy (imagen OpenCV BGR) y devuelve
        los landmarks detectados.

        Retorna:
            dict con formato:
            {
                "left": {
                    "shoulder": (x, y, visibility),
                    "hip":      (x, y, visibility),
                    "knee":     (x, y, visibility),
                    "ankle":    (x, y, visibility),
                },
                "right": { ... idem ... },
                "all_landmarks": [los 33 landmarks crudos],
            }
            O None si no detecto a nadie.

        ¿Por que convertir a RGB?
        OpenCV lee imagenes en BGR (Blue-Green-Red).
        MediaPipe espera RGB (Red-Green-Blue).
        Si no convertimos, los colores estan invertidos y la
        deteccion puede fallar o ser menos precisa.
        """
        # OpenCV usa BGR, MediaPipe espera RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Procesar con MediaPipe
        results = self._pose.process(image_rgb)

        # Si no detecto a nadie, devolver None
        if results.pose_landmarks is None:
            return None

        landmarks = results.pose_landmarks.landmark

        # Extraer los 4 landmarks de cada lado
        def _extract_side(indices: dict[str, int]) -> dict[str, tuple[float, float, float]]:
            side = {}
            for name, idx in indices.items():
                lm = landmarks[idx]
                side[name] = (lm.x, lm.y, lm.visibility)
            return side

        return {
            "left": _extract_side(LEFT_LANDMARKS),
            "right": _extract_side(RIGHT_LANDMARKS),
            "all_landmarks": landmarks,
        }

    def get_visible_side(
        self,
        detection: dict[str, Any],
        min_visibility: float | None = None,
    ) -> dict[str, tuple[float, float, float]] | None:
        """
        Devuelve el lado (izquierdo o derecho) con mejor visibilidad.

        Como la camara es LATERAL, un lado esta mas visible que el otro.
        Esta funcion automaticamente elige el que se ve mejor.

        Parametros:
            detection: el dict que devolvio detect_from_*()
            min_visibility: confianza minima promedio para aceptar
                           un lado. Default: usa POSE_CONFIDENCE_THRESHOLD.

        Retorna:
            dict con los 4 landmarks del lado mas visible, o None
            si ninguno supera el umbral de confianza.
        """
        if min_visibility is None:
            min_visibility = settings.POSE_CONFIDENCE_THRESHOLD

        left = detection["left"]
        right = detection["right"]

        # Promedio de visibilidad de cada lado
        left_avg = sum(v for _, _, v in left.values()) / len(left)
        right_avg = sum(v for _, _, v in right.values()) / len(right)

        # Elegir el mas visible
        if left_avg >= right_avg and left_avg >= min_visibility:
            return left
        elif right_avg >= min_visibility:
            return right

        return None
