"""
seed_exercises.py — Carga el catalogo inicial de ejercicios.

QUE HACE ESTE SCRIPT:
    Inserta los 3 ejercicios del MVP en la tabla 'exercises'.
    Si un ejercicio ya existe (mismo nombre), lo saltea.
    Es seguro correrlo varias veces — no duplica datos.

COMO SE CORRE:
    Desde la carpeta backend/:
        python -m scripts.seed_exercises

CUANDO SE CORRE:
    Una sola vez, cuando se levanta el sistema por primera vez
    (o despues de borrar la DB para empezar de cero).

QUE EJERCICIOS CARGA:
    1. Sentadilla libre (squat)
       - Patologia: condromalacia rotuliana + post-artroscopia
       - Camara: lateral, altura de cadera
       - Evaluador: SquatEvaluator

    2. Extension de rodilla sentado (knee_extension)
       - Patologia: fortalecimiento de cuadriceps post-operatorio
       - Camara: lateral, altura de la silla
       - Evaluador: KneeExtensionEvaluator

    3. Elevacion de pierna recta (straight_leg_raise)
       - Patologia: activacion temprana de cuadriceps
       - Camara: lateral baja (altura del piso)
       - Evaluador: StraightLegRaiseEvaluator
"""

import asyncio
import sys
from pathlib import Path

# Agregar el directorio padre al path para que encuentre 'app'
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.exercise import Exercise


# ── LOS 3 EJERCICIOS DEL MVP ─────────────────────────────────
# Cada dict es un registro de la tabla exercises.
# steps, benefits y target_muscles son listas (se guardan como JSON).

EXERCISES = [
    {
        "name": "Sentadilla libre",
        "zone": "Rodilla",
        "evaluator_key": "squat",
        "description": (
            "Ejercicio funcional de flexion y extension de rodilla. "
            "El paciente baja controladamente flexionando ambas rodillas "
            "y vuelve a la posicion inicial. Fundamental para recuperar "
            "fuerza y rango articular en condromalacia rotuliana y "
            "post-artroscopia de menisco."
        ),
        "steps": [
            "Parate con los pies al ancho de hombros",
            "Mira al frente, espalda recta",
            "Baja flexionando las rodillas como si te sentaras",
            "Las rodillas no deben pasar la punta de los pies",
            "Baja hasta el angulo que te indique el sistema",
            "Subi controladamente hasta quedar parado",
        ],
        "benefits": [
            "Fortalece cuadriceps y gluteos",
            "Mejora el rango de movimiento de la rodilla",
            "Trabaja equilibrio y estabilidad",
            "Ejercicio funcional (simula sentarse/pararse)",
        ],
        "target_muscles": [
            "Cuadriceps",
            "Gluteos",
            "Isquiotibiales",
            "Core",
        ],
    },
    {
        "name": "Extension de rodilla sentado",
        "zone": "Rodilla",
        "evaluator_key": "knee_extension",
        "description": (
            "Ejercicio de aislamiento del cuadriceps. El paciente se "
            "sienta en una silla y extiende la pierna desde la posicion "
            "doblada hasta la extension completa. Ideal para las primeras "
            "semanas post-operatorias donde el paciente no puede hacer "
            "carga completa."
        ),
        "steps": [
            "Sentate en una silla firme con la espalda apoyada",
            "Los pies deben llegar al piso (ajusta la altura)",
            "Estira la pierna lentamente hasta extenderla",
            "Mantene 2 segundos arriba",
            "Baja controladamente a la posicion inicial",
            "No dejes caer la pierna, controla el descenso",
        ],
        "benefits": [
            "Aisla y fortalece el cuadriceps",
            "No requiere carga de peso corporal",
            "Ideal para rehabilitacion temprana",
            "Mejora la extension completa de la rodilla",
        ],
        "target_muscles": [
            "Cuadriceps (recto femoral)",
            "Cuadriceps (vasto medial)",
            "Cuadriceps (vasto lateral)",
        ],
    },
    {
        "name": "Elevacion de pierna recta",
        "zone": "Rodilla",
        "evaluator_key": "straight_leg_raise",
        "description": (
            "Ejercicio de activacion temprana del cuadriceps sin flexion "
            "de rodilla. El paciente se acuesta boca arriba y levanta "
            "la pierna manteniendo la rodilla completamente estirada. "
            "Es el primer ejercicio que se indica post-artroscopia porque "
            "no requiere doblar la rodilla operada."
        ),
        "steps": [
            "Acostate boca arriba en una superficie firme",
            "Dobla la pierna que NO vas a ejercitar (pie apoyado)",
            "La pierna a ejercitar queda estirada en el piso",
            "Levanta la pierna estirada lentamente",
            "Subi hasta el angulo que te indique el sistema",
            "Baja controladamente sin dejar caer la pierna",
        ],
        "benefits": [
            "Activa el cuadriceps sin flexionar la rodilla",
            "Seguro en etapas tempranas post-operatorias",
            "Trabaja flexores de cadera",
            "Mejora el control neuromuscular",
        ],
        "target_muscles": [
            "Cuadriceps (recto femoral)",
            "Flexores de cadera (iliopsoas)",
            "Core (estabilizacion)",
        ],
    },
]


async def main():
    """
    Recorre la lista de ejercicios y los inserta en la DB.
    Si ya existe uno con el mismo nombre, lo saltea.
    """
    print("Seed de ejercicios — Kinova MVP")
    print("=" * 40)

    async with AsyncSessionLocal() as db:
        inserted = 0
        skipped = 0

        for ex_data in EXERCISES:
            # Buscar si ya existe
            result = await db.execute(
                select(Exercise).where(Exercise.name == ex_data["name"])
            )
            existing = result.scalar_one_or_none()

            if existing is not None:
                print(f"  Ya existe: {ex_data['name']} (id={existing.id}) — salteado")
                skipped += 1
                continue

            # Crear el ejercicio
            exercise = Exercise(**ex_data)
            db.add(exercise)
            await db.flush()
            print(f"  Creado: {ex_data['name']} (id={exercise.id})")
            inserted += 1

        await db.commit()

        print()
        print(f"Resultado: {inserted} insertados, {skipped} salteados")
        print("Listo!")


if __name__ == "__main__":
    asyncio.run(main())
