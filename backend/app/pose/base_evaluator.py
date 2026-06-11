from abc import ABC, abstractmethod
from dataclasses import dataclass, field

# Índices MediaPipe para cada lado del cuerpo
LEFT_SIDE  = {"shoulder": 11, "hip": 23, "knee": 25, "ankle": 27}
RIGHT_SIDE = {"shoulder": 12, "hip": 24, "knee": 26, "ankle": 28}


@dataclass
class EvaluationResult:
    status: str  # "perfect" | "improve" | "bad"
    corrections: list[dict] = field(default_factory=list)
    angles: dict[str, float] = field(default_factory=dict)
    rep_counted: bool = False
    total_reps: int = 0


class BaseEvaluator(ABC):
    """
    Clase base para todos los evaluadores de ejercicio.
    Implementa una máquina de 2 estados para contar repeticiones:
    - "down": posición baja del movimiento (ej: sentadilla abajo)
    - "up":   posición alta / inicio
    Una rep se cuenta al completar el ciclo down → up.
    """

    def __init__(self, angle_min: float | None, angle_max: float | None):
        self.angle_min = angle_min
        self.angle_max = angle_max
        self.total_reps = 0
        self._phase = "up"  # empieza esperando que el usuario baje

    @abstractmethod
    def evaluate(self, landmarks: list) -> EvaluationResult:
        """
        Recibe los 33 landmarks de MediaPipe y devuelve el resultado.
        Debe llamar a _count_rep() cuando corresponda.
        """

    def _pick_visible_side(self, lm: list, joints: list[str] | None = None) -> dict:
        """
        Devuelve el dict de índices del lado con mayor visibilidad promedio.
        La cámara es lateral: un lado está bien visible, el otro casi oculto.

        joints: subconjunto de joints a considerar (e.g. ['hip','knee','ankle']).
        Si es None, usa los 4 joints (shoulder, hip, knee, ankle).
        Pasar solo los joints del ejercicio evita que un hombro visible en el
        lado equivocado sesgo la selección (relevante en knee_extension sentado).
        """
        keys = joints if joints else list(LEFT_SIDE.keys())
        left_v  = sum(lm[LEFT_SIDE[k]].visibility  for k in keys) / len(keys)
        right_v = sum(lm[RIGHT_SIDE[k]].visibility for k in keys) / len(keys)
        return LEFT_SIDE if left_v >= right_v else RIGHT_SIDE

    def _count_rep(self, new_phase: str) -> bool:
        """
        Actualiza la fase y cuenta la rep cuando completa el ciclo.
        Devuelve True si se contó una rep.
        """
        if self._phase == "down" and new_phase == "up":
            self.total_reps += 1
            self._phase = new_phase
            return True
        self._phase = new_phase
        return False

    def _make_correction(self, joint: str, message: str, severity: str = "warning") -> dict:
        return {"joint": joint, "message": message, "severity": severity}
