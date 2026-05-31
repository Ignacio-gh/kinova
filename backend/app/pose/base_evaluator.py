from abc import ABC, abstractmethod
from dataclasses import dataclass, field


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
