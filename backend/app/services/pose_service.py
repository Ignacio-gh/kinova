"""
pose_service.py — Orquestador del motor de visión artificial.

Responsabilidad:
    Recibir un frame del WebSocket, pasarlo por MediaPipe, aplicar el
    evaluador específico del ejercicio, y devolver feedback estructurado.

NOTA:
    La implementación detallada del MOTOR (detector, angle_calculator,
    evaluadores específicos por ejercicio) vive en su propio módulo
    cuando se implemente. Este service es el orquestador a nivel de
    aplicación.

Funciones planeadas:

    class PoseSession:
        '''
        Mantiene el estado de una sesión activa del WebSocket:
        - evaluador cargado
        - máquina de estados de conteo (REPOSO ↔ ESFUERZO)
        - ángulos efectivos para el paciente
        '''

        def __init__(self, exercise, effective_angles, target_reps):
            ...

        def process_frame(self, frame_bytes) -> PoseFeedbackMessage:
            '''
            1. Decodifica frame (OpenCV)
            2. Pasa por MediaPipe → landmarks
            3. Pasa landmarks al evaluador → resultado
            4. Actualiza máquina de conteo
            5. Devuelve PoseFeedbackMessage
            '''

    EVALUATOR_REGISTRY = {
        "squat": SquatEvaluator,
        "knee_extension": KneeExtensionEvaluator,
        "straight_leg_raise": StraightLegRaiseEvaluator,
    }

    async def create_pose_session(execution_id, db) -> PoseSession:
        - Carga ExerciseExecution
        - Carga Exercise relacionado
        - Lee evaluator_key
        - Instancia el evaluador correspondiente del REGISTRY
        - Devuelve PoseSession lista para procesar frames

Dependencias:
    - MediaPipe (detector)
    - OpenCV (decodificación)
    - app.repositories.session_repository
    - El módulo de evaluadores (a definir cuando se implemente la cámara)

Rol arquitectónico:
    Bisagra entre el WebSocket y el motor de visión.
    El WebSocket solo sabe de mensajes; el motor solo sabe de pose.
    Este service traduce entre los dos.
"""

# TODO: EVALUATOR_REGISTRY = {...}
# TODO: class PoseSession
# TODO: async def create_pose_session(db, execution_id)
