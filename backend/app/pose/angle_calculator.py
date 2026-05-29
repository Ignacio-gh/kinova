import math


def calculate_angle(a: tuple, b: tuple, c: tuple) -> float:
    """
    Calcula el ángulo en el punto B formado por los segmentos BA y BC.
    Los puntos son tuplas (x, y) o (x, y, z).
    Devuelve el ángulo en grados (0-180).
    """
    ax, ay = a[0] - b[0], a[1] - b[1]
    cx, cy = c[0] - b[0], c[1] - b[1]

    dot = ax * cx + ay * cy
    mag_a = math.sqrt(ax**2 + ay**2)
    mag_c = math.sqrt(cx**2 + cy**2)

    if mag_a == 0 or mag_c == 0:
        return 0.0

    cos_angle = max(-1.0, min(1.0, dot / (mag_a * mag_c)))
    return math.degrees(math.acos(cos_angle))
