from app.pose.angle_calculator import calculate_angle
from app.pose.base_evaluator import BaseEvaluator, EvaluationResult

# Ángulo de cadera por debajo del cual la pierna está "arriba"
RAISED_THRESHOLD = 155.0

# Rodilla doblada si su ángulo es menor a este valor
KNEE_STRAIGHT_THRESHOLD = 160.0


class StraightLegRaiseEvaluator(BaseEvaluator):
    """
    Evaluador de elevación de pierna recta acostado.

    El paciente está acostado boca arriba. Levanta una pierna
    manteniéndola recta mientras la otra permanece doblada.

    Reglas clínicas:
    - La rodilla DEBE permanecer estirada (es lo más importante)
    - No superar la elevación máxima (angle_max)
    - Alcanzar la elevación mínima (angle_min)

    Una rep = pierna abajo → sube → vuelve abajo.
    El paciente debe posicionarse con la pierna activa hacia la cámara.
    """

    def evaluate(self, landmarks: list) -> EvaluationResult:
        lm = landmarks

        # Usar el lado más visible — el paciente debe tener la pierna activa
        # orientada hacia la cámara para una detección confiable.
        side = self._pick_visible_side(lm)
        SH, HI, KN, AN = side["shoulder"], side["hip"], side["knee"], side["ankle"]

        def pt(idx):
            return (lm[idx].x, lm[idx].y)

        hip_angle  = calculate_angle(pt(AN), pt(HI), pt(SH))
        knee_angle = calculate_angle(pt(HI), pt(KN), pt(AN))
        hip_elevation = round(180 - hip_angle, 1)

        corrections = []
        status = "perfect"

        # ── Rodilla doblada (error crítico en este ejercicio) ──
        if knee_angle < KNEE_STRAIGHT_THRESHOLD:
            corrections.append(
                self._make_correction(
                    "rodilla",
                    f"Mantené la rodilla completamente estirada — "
                    f"está doblada a {round(180 - knee_angle)}°",
                    "error",
                )
            )
            status = "bad"

        # ── Elevación supera el máximo permitido ──
        if self.angle_max is not None and hip_elevation > self.angle_max:
            corrections.append(
                self._make_correction(
                    "cadera",
                    f"No subas tanto la pierna — elevación a {hip_elevation}°, "
                    f"tu kinesiólogo puso un máximo de {self.angle_max}°",
                    "error",
                )
            )
            if status != "bad":
                status = "bad"

        # ── No eleva lo suficiente ──
        if self._phase == "up" and self.angle_min is not None and hip_elevation < self.angle_min:
            corrections.append(
                self._make_correction(
                    "cadera",
                    f"Subí un poco más la pierna — estás a {hip_elevation}°, "
                    f"tu objetivo es llegar a {self.angle_min}°",
                    "warning",
                )
            )
            if status == "perfect":
                status = "improve"

        new_phase = "up" if hip_angle < RAISED_THRESHOLD else "down"
        rep_counted = self._count_rep(new_phase)

        return EvaluationResult(
            status=status,
            corrections=corrections,
            angles={"hip": round(hip_angle, 1), "knee": round(knee_angle, 1)},
            rep_counted=rep_counted,
            total_reps=self.total_reps,
        )
