"""
angle_calculator.py — Calculo de angulos entre 3 puntos del cuerpo.

QUE HACE ESTE ARCHIVO:
    Una sola funcion: recibe 3 puntos (A, B, C) y calcula el angulo
    en el punto B (el del medio). Eso es TODO.

POR QUE ES IMPORTANTE:
    La rehabilitacion de rodilla se basa en angulos:
    - "El paciente puede flexionar la rodilla hasta 90 grados"
    - "Esta semana el limite es 110 grados"

    Para medir el angulo de la rodilla necesitamos 3 puntos:
    - A = cadera (hip)
    - B = rodilla (knee)  ← el angulo se mide ACA
    - C = tobillo (ankle)

    MediaPipe nos da las coordenadas (x, y) de cada punto.
    Esta funcion recibe esos 3 puntos y devuelve el angulo en grados.

COMO FUNCIONA LA MATEMATICA:
    Imaginate una rodilla:

        Cadera (A)
           \\
            \\  <- este angulo queremos medir
             \\
         Rodilla (B) ----- Tobillo (C)

    1. Creamos dos vectores desde B:
       - Vector BA = A - B (de la rodilla hacia la cadera)
       - Vector BC = C - B (de la rodilla hacia el tobillo)

    2. Usamos arcotangente (atan2) para calcular el angulo de cada
       vector respecto al eje horizontal.

    3. Restamos los angulos → angulo entre los dos vectores.

    4. Normalizamos al rango 0-180 grados.

    ¿Por que atan2 y no acos (arcocoseno)?
    Porque atan2 es mas estable numericamente. Con acos, si los puntos
    estan casi alineados (angulo ~180), pueden haber errores de redondeo
    que hagan que el coseno sea 1.0001 y acos explote. atan2 no tiene
    ese problema.
"""

import math


def calculate_angle(
    a: tuple[float, float],
    b: tuple[float, float],
    c: tuple[float, float],
) -> float:
    """
    Calcula el angulo en el punto B formado por los segmentos BA y BC.

    Parametros:
        a: coordenadas (x, y) del primer punto (ej: cadera)
        b: coordenadas (x, y) del vertice (ej: rodilla) ← angulo aca
        c: coordenadas (x, y) del tercer punto (ej: tobillo)

    Retorna:
        Angulo en grados, entre 0 y 180.
        - 180 = pierna totalmente estirada
        - 90  = rodilla en angulo recto
        - 0   = pierna totalmente doblada (imposible anatomicamente)

    Ejemplos:
        # Pierna estirada (180 grados)
        calculate_angle((0, 1), (0, 0), (0, -1))  → 180.0

        # Angulo recto (90 grados)
        calculate_angle((0, 1), (0, 0), (1, 0))   → 90.0
    """
    # Coordenadas de cada punto
    ax, ay = a
    bx, by = b
    cx, cy = c

    # Angulo del vector BA respecto al eje X
    angle_ba = math.atan2(ay - by, ax - bx)

    # Angulo del vector BC respecto al eje X
    angle_bc = math.atan2(cy - by, cx - bx)

    # Diferencia entre los dos angulos
    angle_rad = abs(angle_ba - angle_bc)

    # Convertir de radianes a grados
    angle_deg = math.degrees(angle_rad)

    # Normalizar al rango 0-180
    # (si el angulo es mayor a 180, tomamos el complemento)
    if angle_deg > 180:
        angle_deg = 360 - angle_deg

    return round(angle_deg, 1)
