from app.pose.angle_calculator import calculate_angle
from app.pose.base_evaluator import BaseEvaluator, EvaluationResult

KNEE_STRAIGHT_THRESHOLD = 160.0


class SquatEvaluator(BaseEvaluator):
    """
    Evaluador de sentadilla.

    Evalúa el ángulo de rodilla (cadera-rodilla-tobillo) controlado por
    angle_min/angle_max del kinesiólogo.

    Una rep = rodilla baja (< 160°) y vuelve a extenderse (≥ 160°).
    """

    def evaluate(self, landmarks: list) -> EvaluationResult:
        lm = landmarks

        side = self._pick_visible_side(lm, joints=["hip", "knee", "ankle"])
        HI, KN, AN = side["hip"], side["knee"], side["ankle"]

        def pt(idx):
            return (lm[idx].x, lm[idx].y)

        knee_angle   = calculate_angle(pt(HI), pt(KN), pt(AN))
        knee_flexion = round(180 - knee_angle, 1)

        corrections = []
        status = "perfect"

        # ── Flexión supera el máximo permitido ──
        if self.angle_max is not None and knee_flexion > self.angle_max:
            corrections.append(
                self._make_correction(
                    "rodilla",
                    f"Estás bajando demasiado — flexión a {knee_flexion}°, "
                    f"máximo permitido: {self.angle_max}°",
                    "error",
                )
            )
            status = "bad"

        # ── No baja lo suficiente ──
        elif self._phase == "down" and self.angle_min is not None and knee_flexion < self.angle_min:
            corrections.append(
                self._make_correction(
                    "rodilla",
                    f"Bajá un poco más — flexión a {knee_flexion}°, "
                    f"mínimo requerido: {self.angle_min}°",
                    "warning",
                )
            )
            status = "improve"

        new_phase = "down" if knee_angle < KNEE_STRAIGHT_THRESHOLD else "up"
        rep_counted = self._count_rep(new_phase)

        return EvaluationResult(
            status=status,
            corrections=corrections,
            angles={"knee": round(knee_angle, 1)},
            rep_counted=rep_counted,
            total_reps=self.total_reps,
        )
