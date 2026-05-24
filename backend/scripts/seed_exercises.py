"""
seed_exercises.py — Carga el catálogo inicial de ejercicios.

Responsabilidad:
    Insertar en la DB los ejercicios definidos para el MVP.

Ejercicios planeados (MVP — rehab de rodilla):
    1. Sentadilla libre (squat)
       - zone: "Rodilla"
       - evaluator_key: "squat"

    2. Extensión de rodilla sentado (knee_extension)
       - zone: "Rodilla"
       - evaluator_key: "knee_extension"

    3. Elevación de pierna recta (straight_leg_raise)
       - zone: "Rodilla"
       - evaluator_key: "straight_leg_raise"

    (más ejercicios del frontend pueden agregarse, pero sin evaluador
     hasta que se implementen)

Uso:
    python -m scripts.seed_exercises

Notas:
    - El script es idempotente: si un ejercicio ya existe, lo ignora
    - Si querés "resetear" el catálogo, borrar la tabla y volver a correr
"""

# TODO: Importar Async session
# TODO: Definir lista de ejercicios con sus pasos, beneficios y evaluator_key
# TODO: Función async main() que upsert cada ejercicio
# TODO: if __name__ == "__main__": asyncio.run(main())
