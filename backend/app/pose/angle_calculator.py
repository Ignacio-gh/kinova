"""
angle_calculator.py — Calculo de angulos entre 3 puntos del cuerpo.

Recibe 3 puntos (A, B, C) y calcula el angulo en el punto B.
Los puntos pueden ser tuplas (x, y) o (x, y, z).
"""

import math


def calculate_angle(
    a: tuple[float, ...],
    b: tuple[float, ...],
    c: tuple[float, ...],
) -> float:
    """
    Calcula el angulo en el punto B formado por los segmentos BA y BC.

    Parametros:
        a: coordenadas del primer punto (ej: cadera)
        b: coordenadas del vertice (ej: rodilla) <- angulo aca
        c: coordenadas del tercer punto (ej: tobillo)

    Retorna:
        Angulo en grados, entre 0 y 180.
        180 = pierna estirada, 90 = angulo recto.
    """
    # Vectores desde B hacia A y desde B hacia C
    ax, ay = a[0] - b[0], a[1] - b[1]
    cx, cy = c[0] - b[0], c[1] - b[1]

    # Producto punto y magnitudes
    dot = ax * cx + ay * cy
    mag_a = math.sqrt(ax**2 + ay**2)
    mag_c = math.sqrt(cx**2 + cy**2)

    # Proteccion contra division por cero (puntos superpuestos)
    if mag_a == 0 or mag_c == 0:
        return 0.0

    # Clampear a [-1, 1] para evitar errores de redondeo en acos
    cos_angle = max(-1.0, min(1.0, dot / (mag_a * mag_c)))

    return round(math.degrees(math.acos(cos_angle)), 1)
