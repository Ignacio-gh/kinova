from app.pose.angle_calculator import calculate_angle
from app.pose.base_evaluator import BaseEvaluator, EvaluationResult


class SquatEvaluator(BaseEvaluator):
    """
    Evaluador de sentadilla.

    Reglas clínicas:
    - Tronco: mantener por encima de 130° (inclinación natural permitida)
    - Rodilla: no pasar la punta del pie
    - Rango: respetar angle_min (mínima flexión) y angle_max (máxima flexión)

    Una rep se cuenta cuando la rodilla baja y vuelve a extenderse (> 160°).
    """

    KNEE_STRAIGHT_THRESHOLD = 160.0
    TRUNK_MIN_ANGLE = 130.0

    def evaluate(self, landmarks: list) -> EvaluationResult:
        lm = landmarks

        # Usar solo el lado más visible — la cámara es lateral y el lado
        # opuesto tiene landmarks de baja confianza que distorsionan los ángulos.
        side = self._pick_visible_side(lm)
        SH, HI, KN, AN = side["shoulder"], side["hip"], side["knee"], side["ankle"]

        def pt(idx):
            return (lm[idx].x, lm[idx].y)

        knee_angle = calculate_angle(pt(HI), pt(KN), pt(AN))
        knee_flexion = round(180 - knee_angle, 1)
        trunk_angle = calculate_angle(pt(SH), pt(HI), pt(KN))

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
        # Izquierdo (idx 25): paciente de perfil mirando a la derecha → avance = x sube
        # Derecho   (idx 26): paciente de perfil mirando a la izquierda → avance = x baja
        if KN == 25:
            knee_over_toe = lm[KN].x > lm[AN].x + 0.05
        else:
            knee_over_toe = lm[KN].x < lm[AN].x - 0.05

        if knee_over_toe:
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
