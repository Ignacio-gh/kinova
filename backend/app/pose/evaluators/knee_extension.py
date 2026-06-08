from app.pose.angle_calculator import calculate_angle
from app.pose.base_evaluator import BaseEvaluator, EvaluationResult

HIP_L, HIP_R = 23, 24
KNEE_L, KNEE_R = 25, 26
ANKLE_L, ANKLE_R = 27, 28
SHOULDER_L, SHOULDER_R = 11, 12

# Ángulo landmark por debajo del cual consideramos la rodilla "doblada" (fase abajo)
BENT_THRESHOLD = 130.0


class KneeExtensionEvaluator(BaseEvaluator):
    """
    Evaluador de extensión de rodilla sentado.

    El paciente arranca sentado con la rodilla doblada (~90°) y estira
    hacia la extensión completa (~180° landmark).

    Reglas clínicas:
    - Debe alcanzar la extensión mínima requerida (angle_min)
    - No debe superar la flexión máxima permitida (angle_max)
    - Movimiento controlado, sin impulso

    Una rep = dobla la rodilla → estira completamente.
    """

    def __init__(self, angle_min: float | None, angle_max: float | None):
        super().__init__(angle_min, angle_max)
        self._phase = "down"  # arranca sentado (rodilla doblada)
        self._peak_extension = 180.0

    def evaluate(self, landmarks: list) -> EvaluationResult:
        lm = landmarks

        def pt(idx):
            return (lm[idx].x, lm[idx].y)

        knee_angle_l = calculate_angle(pt(HIP_L), pt(KNEE_L), pt(ANKLE_L))
        knee_angle_r = calculate_angle(pt(HIP_R), pt(KNEE_R), pt(ANKLE_R))
        knee_angle = (knee_angle_l + knee_angle_r) / 2
        knee_flexion = round(180 - knee_angle, 1)

        if self._phase == "up":
            self._peak_extension = min(self._peak_extension, knee_angle)

        corrections = []
        status = "perfect"

        # ── Flexión supera el máximo permitido ──
        if self.angle_max is not None and knee_flexion > self.angle_max:
            corrections.append(
                self._make_correction(
                    "rodilla",
                    f"No dobles tanto la rodilla — estás a {knee_flexion}° de flexión, "
                    f"tu kinesiólogo puso un máximo de {self.angle_max}°",
                    "error",
                )
            )
            status = "bad"

        # ── No extiende lo suficiente ──
        if self._phase == "up" and self.angle_min is not None and knee_flexion > self.angle_min:
            corrections.append(
                self._make_correction(
                    "rodilla",
                    f"Estirá más la pierna — estás a {knee_flexion}° de flexión, "
                    f"necesitás llegar a menos de {self.angle_min}°",
                    "warning",
                )
            )
            if status == "perfect":
                status = "improve"

        new_phase = "up" if knee_angle > BENT_THRESHOLD else "down"

        if new_phase == "down":
            self._peak_extension = 180.0

        rep_counted = self._count_rep(new_phase)

        return EvaluationResult(
            status=status,
            corrections=corrections,
            angles={"knee": round(knee_angle, 1)},
            rep_counted=rep_counted,
            total_reps=self.total_reps,
        )
