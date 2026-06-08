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

    Reglas clínicas:
    - Tronco: mantener por encima de 130° (inclinación natural permitida)
    - Rodilla: no pasar la punta del pie (valgo/colapso)
    - Rango: respetar angle_min (mínima flexión) y angle_max (máxima flexión)

    Una rep se cuenta cuando la rodilla baja y vuelve a extenderse (> 160°).
    """

    KNEE_STRAIGHT_THRESHOLD = 160.0
    TRUNK_MIN_ANGLE = 130.0

    def evaluate(self, landmarks: list) -> EvaluationResult:
        lm = landmarks

        def pt(idx):
            return (lm[idx].x, lm[idx].y)

        knee_angle_l = calculate_angle(pt(HIP_L), pt(KNEE_L), pt(ANKLE_L))
        knee_angle_r = calculate_angle(pt(HIP_R), pt(KNEE_R), pt(ANKLE_R))
        knee_angle = (knee_angle_l + knee_angle_r) / 2
        knee_flexion = round(180 - knee_angle, 1)

        hip_mid = ((lm[HIP_L].x + lm[HIP_R].x) / 2, (lm[HIP_L].y + lm[HIP_R].y) / 2)
        shoulder_mid = (
            (lm[SHOULDER_L].x + lm[SHOULDER_R].x) / 2,
            (lm[SHOULDER_L].y + lm[SHOULDER_R].y) / 2,
        )
        knee_mid = ((lm[KNEE_L].x + lm[KNEE_R].x) / 2, (lm[KNEE_L].y + lm[KNEE_R].y) / 2)
        trunk_angle = calculate_angle(shoulder_mid, hip_mid, knee_mid)

        corrections = []
        status = "perfect"

        # ── Tronco demasiado inclinado ──
        if trunk_angle < self.TRUNK_MIN_ANGLE:
            corrections.append(
                self._make_correction(
                    "tronco",
                    f"Llevá el pecho hacia arriba y la mirada al frente — "
                    f"tronco a {round(trunk_angle)}°, mantenerlo por encima de {round(self.TRUNK_MIN_ANGLE)}°",
                    "warning",
                )
            )
            status = "improve"

        # ── Rodilla pasa la punta del pie ──
        knee_over_toe_l = lm[KNEE_L].x > lm[ANKLE_L].x + 0.05
        knee_over_toe_r = lm[KNEE_R].x < lm[ANKLE_R].x - 0.05
        if knee_over_toe_l or knee_over_toe_r:
            corrections.append(
                self._make_correction(
                    "rodilla",
                    "Alineá las rodillas con los pies, no dejes que pasen la punta",
                    "warning",
                )
            )
            status = "improve"

        # ── Flexión supera el máximo permitido por el kinesiólogo ──
        if self.angle_max is not None and knee_flexion > self.angle_max:
            corrections.append(
                self._make_correction(
                    "rodilla",
                    f"Estás bajando demasiado — flexión a {knee_flexion}°, "
                    f"tu kinesiólogo puso un máximo de {self.angle_max}°",
                    "error",
                )
            )
            status = "bad"

        # ── No baja lo suficiente (mínimo requerido) ──
        if (
            self._phase == "down"
            and self.angle_min is not None
            and knee_flexion < self.angle_min
        ):
            corrections.append(
                self._make_correction(
                    "rodilla",
                    f"Bajá un poco más — estás a {knee_flexion}° de flexión, "
                    f"necesitás llegar al menos a {self.angle_min}°",
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
