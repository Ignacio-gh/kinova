"""
detector.py — Wrapper de MediaPipe Pose (Tasks API).
"""

import base64
import io
import os
import time
from typing import Any

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.core import base_options as base_options_module
from PIL import Image, ImageOps

from app.config.settings import settings

_DIR = os.path.dirname(__file__)
_LITE_MODEL = os.path.join(_DIR, "pose_landmarker_lite.task")
_FULL_MODEL = os.path.join(_DIR, "pose_landmarker_full.task")
_MODEL_PATH = _LITE_MODEL if os.path.exists(_LITE_MODEL) else _FULL_MODEL

LEFT_LANDMARKS = {
    "shoulder": 11,
    "hip": 23,
    "knee": 25,
    "ankle": 27,
}

RIGHT_LANDMARKS = {
    "shoulder": 12,
    "hip": 24,
    "knee": 26,
    "ankle": 28,
}


class PoseDetector:
    _instance: "PoseDetector | None" = None

    def __new__(cls) -> "PoseDetector":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return

        options = vision.PoseLandmarkerOptions(
            base_options=base_options_module.BaseOptions(model_asset_path=_MODEL_PATH),
            running_mode=vision.RunningMode.VIDEO,
            min_pose_detection_confidence=settings.POSE_CONFIDENCE_THRESHOLD,
            min_pose_presence_confidence=settings.POSE_CONFIDENCE_THRESHOLD,
            min_tracking_confidence=0.15,
        )
        self._landmarker = vision.PoseLandmarker.create_from_options(options)
        self._start_ts = time.monotonic()
        self._initialized = True
        import logging
        logging.getLogger("kinova.pose").info("PoseDetector usando modelo: %s", _MODEL_PATH)

    def detect_from_bytes(self, image_bytes: bytes) -> dict[str, Any] | None:
        try:
            pil_img = Image.open(io.BytesIO(image_bytes))
            pil_img = ImageOps.exif_transpose(pil_img)
            if pil_img.mode != "RGB":
                pil_img = pil_img.convert("RGB")
            image = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        except Exception:
            np_array = np.frombuffer(image_bytes, dtype=np.uint8)
            image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if image is None:
            return None

        h, w = image.shape[:2]
        if max(h, w) > 480:
            scale = 480 / max(h, w)
            image = cv2.resize(image, (int(w * scale), int(h * scale)))

        return self.detect_from_array(image)

    def detect_from_base64(self, base64_string: str) -> dict[str, Any] | None:
        if "," in base64_string:
            base64_string = base64_string.split(",", 1)[1]
        image_bytes = base64.b64decode(base64_string)
        return self.detect_from_bytes(image_bytes)

    def detect_from_array(self, image: np.ndarray) -> dict[str, Any] | None:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
        timestamp_ms = int((time.monotonic() - self._start_ts) * 1000)
        result = self._landmarker.detect_for_video(mp_image, timestamp_ms)

        if not result.pose_landmarks:
            return None

        landmarks = result.pose_landmarks[0]

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
        if min_visibility is None:
            min_visibility = settings.POSE_CONFIDENCE_THRESHOLD

        left = detection["left"]
        right = detection["right"]

        left_avg = sum(v for _, _, v in left.values()) / len(left)
        right_avg = sum(v for _, _, v in right.values()) / len(right)

        if left_avg >= right_avg and left_avg >= min_visibility:
            return left
        elif right_avg >= min_visibility:
            return right

        return None
