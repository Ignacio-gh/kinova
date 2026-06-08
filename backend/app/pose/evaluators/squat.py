from app.pose.angle_calculator import calculate_angle
from app.pose.base_evaluator import BaseEvaluator, EvaluationResult

# Índices de landmarks de MediaPipe Pose
HIP_L, HIP_R = 23, 24
KNEE_L, KNEE_R = 25, 26
ANKLE_L, ANKLE_R = 27, 28
SHOULDER_L, SHOULDER_R = 11, 12
NOSE = 0


class SquatEvaluator(BaseEvaluator):
    """
    Evaluador de sentadilla.

    Reglas:
    - Ángulo de rodilla: debe estar dentro del rango efectivo del paciente
    - Ángulo de tronco: debe mantenerse erguido (> 150° respecto cadera-hombro)
    - Rodilla no debe pasar la punta del pie (alineación frontal)

    Una rep se cuenta cuando la rodilla baja al ángulo mínimo y vuelve
    a la posición inicial (> 160°).
    """

    KNEE_STRAIGHT_THRESHOLD = 160.0  # ángulo considerado "arriba" (parado)
    TRUNK_MIN_ANGLE = 130.0          # tronco muy inclinado si es menor
    # 150° era demasiado estricto — en una sentadilla real el tronco
    # se inclina naturalmente hacia adelante. 130° permite esa inclinación
    # normal y solo alerta cuando realmente se está "cayendo" hacia adelante.

    def evaluate(self, landmarks: list) -> EvaluationResult:
        lm = landmarks

        def pt(idx):
            return (lm[idx].x, lm[idx].y)

        knee_angle_l = calculate_angle(pt(HIP_L), pt(KNEE_L), pt(ANKLE_L))
        knee_angle_r = calculate_angle(pt(HIP_R), pt(KNEE_R), pt(ANKLE_R))
        knee_angle = (knee_angle_l + knee_angle_r) / 2

        hip_mid = ((lm[HIP_L].x + lm[HIP_R].x) / 2, (lm[HIP_L].y + lm[HIP_R].y) / 2)
        shoulder_mid = (
            (lm[SHOULDER_L].x + lm[SHOULDER_R].x) / 2,
            (lm[SHOULDER_L].y + lm[SHOULDER_R].y) / 2,
        )
        knee_mid = ((lm[KNEE_L].x + lm[KNEE_R].x) / 2, (lm[KNEE_L].y + lm[KNEE_R].y) / 2)
        trunk_angle = calculate_angle(shoulder_mid, hip_mid, knee_mid)

        corrections = []
        status = "perfect"

        if trunk_angle < self.TRUNK_MIN_ANGLE:
            corrections.append(
                self._make_correction("tronco", "Mantené el tronco más erguido", "warning")
            )
            status = "improve"

        knee_over_toe_l = lm[KNEE_L].x > lm[ANKLE_L].x + 0.05
        knee_over_toe_r = lm[KNEE_R].x < lm[ANKLE_R].x - 0.05
        if knee_over_toe_l or knee_over_toe_r:
            corrections.append(
                self._make_correction("rodilla", "La rodilla no debe pasar la punta del pie", "warning")
            )
            status = "improve"

        if self.angle_max is not None and knee_angle < (180 - self.angle_max):
            corrections.append(
                self._make_correction(
                    "rodilla",
                    f"Estás doblando más de lo permitido ({self.angle_max}°)",
                    "error",
                )
            )
            status = "bad"

        if (
            self._phase == "down"
            and self.angle_min is not None
            and knee_angle > (180 - self.angle_min)
        ):
            corrections.append(
                self._make_correction(
                    "rodilla",
                    f"Bajá un poco más, el mínimo es {self.angle_min}°",
                    "warning",
                )
            )
            if status == "perfect":
                status = "improve"

        new_phase = "down" if knee_angle < self.KNEE_STRAIGHT_THRESHOLD else "up"
        rep_counted = self._count_rep(new_phase)

        return EvaluationResult(
            status=status,
            corrections=corrections,
            angles={"knee": round(knee_angle, 1), "trunk": round(trunk_angle, 1)},
            rep_counted=rep_counted,
            total_reps=self.total_reps,
        )
