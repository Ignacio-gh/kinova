import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { usePoseWebSocket, type PoseLandmark, type PoseWSFeedback } from './use-pose-websocket';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type PostureStatus = 'correct' | 'warning' | 'incorrect';

export type FeedbackItem = {
  status: PostureStatus;
  message: string;
};

export type ExerciseStep = {
  number: number;
  text: string;
};

// ─── Mapeo de nombre de ejercicio a evaluator_key del backend ─────────────────

function resolveEvaluatorKey(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes('sentadilla') || lower.includes('squat')) return 'squat';
  if (lower.includes('extensi')) return 'knee_extension';
  if (lower.includes('elevaci') || lower.includes('pierna recta') || lower.includes('slr'))
    return 'straight_leg_raise';
  return null;
}

// ─── Mapeo de estado del backend al estado de UI ──────────────────────────────

function wsFeedbackToItem(fb: PoseWSFeedback): FeedbackItem {
  const statusMap: Record<string, PostureStatus> = {
    perfect: 'correct',
    improve: 'warning',
    bad:     'incorrect',
  };
  const status: PostureStatus = statusMap[fb.status] ?? 'correct';
  const defaultMsg: Record<PostureStatus, string> = {
    correct:   '¡Postura correcta! Seguí así.',
    warning:   'Pequeños ajustes necesarios.',
    incorrect: 'Corregí la postura ahora.',
  };
  const message = fb.corrections.length > 0
    ? fb.corrections[0].message
    : defaultMsg[status];
  return { status, message };
}

// ─── Mock data (fallback cuando el backend no está disponible) ────────────────

const DEFAULT_STEPS: ExerciseStep[] = [
  { number: 1, text: 'Mantené la espalda recta en todo momento' },
  { number: 2, text: 'Bajá lentamente y de forma controlada' },
  { number: 3, text: 'No bloquees las rodillas en la extensión' },
  { number: 4, text: 'Mantené el peso en el talón delantero' },
  { number: 5, text: 'Controlá la respiración durante el movimiento' },
];

const EXERCISE_DB: Record<string, {
  steps: ExerciseStep[];
  feedbackCycle: FeedbackItem[];
}> = {
  sentadilla: {
    steps: DEFAULT_STEPS,
    feedbackCycle: [
      { status: 'correct',   message: 'Alineá la rodilla con el tobillo' },
      { status: 'correct',   message: 'Espalda recta, ¡excelente!' },
      { status: 'warning',   message: 'Bajá un poco más lento' },
      { status: 'correct',   message: 'Rango de movimiento correcto' },
      { status: 'incorrect', message: 'Rodilla doblando hacia adentro' },
      { status: 'correct',   message: 'Postura general correcta' },
      { status: 'warning',   message: 'Mantené el core activo' },
      { status: 'correct',   message: '¡Excelente serie!' },
    ],
  },
  extension: {
    steps: [
      { number: 1, text: 'Sentate con la espalda apoyada en el respaldo' },
      { number: 2, text: 'Extendé la pierna hasta la posición horizontal' },
      { number: 3, text: 'Mantené 2 segundos en la extensión completa' },
      { number: 4, text: 'Bajá controlando el movimiento' },
      { number: 5, text: 'No soltés el peso de golpe' },
    ],
    feedbackCycle: [
      { status: 'correct',   message: 'Extensión completa correcta' },
      { status: 'warning',   message: 'Extendé un poco más la rodilla' },
      { status: 'correct',   message: 'Mantené ese rango de movimiento' },
      { status: 'incorrect', message: 'Velocidad muy alta en el descenso' },
      { status: 'correct',   message: 'Control excéntrico perfecto' },
      { status: 'warning',   message: 'Apoyá mejor la espalda' },
    ],
  },
  default: {
    steps: DEFAULT_STEPS,
    feedbackCycle: [
      { status: 'correct',   message: 'Buena postura general' },
      { status: 'correct',   message: 'Seguí así, muy bien' },
      { status: 'warning',   message: 'Controlá la velocidad del movimiento' },
      { status: 'correct',   message: 'Rango de movimiento adecuado' },
      { status: 'incorrect', message: 'Corregí la alineación del tronco' },
      { status: 'correct',   message: '¡Excelente ejecución!' },
    ],
  },
};

function resolveExerciseKey(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('sentadilla')) return 'sentadilla';
  if (lower.includes('extensi'))    return 'extension';
  return 'default';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEjercicioSesion(
  exerciseName: string,
  muscle: string,
  targetReps: number,
  targetSeries: number,
  angleMin: number | null = null,
  angleMax: number | null = null,
) {
  const router = useRouter();
  const dbKey = resolveExerciseKey(exerciseName);
  const evaluatorKey = resolveEvaluatorKey(exerciseName);
  const db = EXERCISE_DB[dbKey];

  const [isRunning, setIsRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Estado mock (fallback cuando el backend no está conectado)
  const [mockFeedbackIndex, setMockFeedbackIndex] = useState(0);
  const [mockReps, setMockReps] = useState(0);
  const [mockSeries, setMockSeries] = useState(1);

  // WebSocket de pose
  const { feedback, connected, sendFrame } = usePoseWebSocket(evaluatorKey, isRunning, angleMin, angleMax);

  // Guardamos el total_reps previo para detectar nuevas reps
  const prevTotalReps = useRef(0);

  // Últimos landmarks válidos — se mantienen aunque el siguiente frame
  // no detecte ningún punto, evitando que el esqueleto desaparezca y reaparezca.
  const stableLandmarksRef = useRef<Record<string, PoseLandmark>>({});
  if (feedback?.landmarks && Object.keys(feedback.landmarks).length > 0) {
    stableLandmarksRef.current = feedback.landmarks;
  }

  // ── Reloj ──
  useEffect(() => {
    if (!isRunning || sessionFinished) return;
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, sessionFinished]);

  // ── Ciclo de feedback mock (solo cuando no hay WebSocket) ──
  useEffect(() => {
    if (connected || !isRunning || sessionFinished) return;
    const id = setInterval(() => {
      setMockFeedbackIndex((i) => (i + 1) % db.feedbackCycle.length);
    }, 3000);
    return () => clearInterval(id);
  }, [connected, isRunning, sessionFinished, db.feedbackCycle.length]);

  // ── Contador de reps mock (solo cuando no hay WebSocket) ──
  useEffect(() => {
    if (connected || !isRunning || sessionFinished) return;
    const id = setInterval(() => {
      setMockReps((r) => {
        const next = r + 1;
        if (next >= targetReps) {
          setMockSeries((s) => {
            if (s >= targetSeries) {
              setSessionFinished(true);
              return s;
            }
            return s + 1;
          });
          return 0;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [connected, isRunning, sessionFinished, targetReps, targetSeries]);

  // ── Contador de reps real (desde WebSocket) ──
  useEffect(() => {
    if (!connected || !feedback) return;
    const newTotal = feedback.total_reps;
    if (newTotal === prevTotalReps.current) return;
    prevTotalReps.current = newTotal;

    if (newTotal >= targetReps * targetSeries) {
      setSessionFinished(true);
    }
  }, [connected, feedback, targetReps, targetSeries]);

  // ── Valores derivados ──

  // Reps y series actuales (real o mock)
  const reps = connected && feedback
    ? feedback.total_reps % targetReps
    : mockReps;

  const series = connected && feedback
    ? Math.min(Math.floor(feedback.total_reps / targetReps) + 1, targetSeries)
    : mockSeries;

  // Feedback de postura (real o mock)
  const currentFeedback: FeedbackItem | null = connected && feedback
    ? wsFeedbackToItem(feedback)
    : db.feedbackCycle[mockFeedbackIndex];

  // Landmarks: usa los del feedback actual, o los últimos válidos si no hay detección.
  // Esto evita que el esqueleto "parpadee" cuando un frame no detecta al paciente.
  const landmarks: Record<string, PoseLandmark> | null = connected
    ? (Object.keys(stableLandmarksRef.current).length > 0 ? stableLandmarksRef.current : null)
    : null;
  const angles: Record<string, number> | null = connected
    ? (feedback?.angles ?? null)
    : null;
  const wsStatus = feedback?.status ?? null;

  const togglePause = useCallback(() => setIsRunning((r) => !r), []);
  const finishSession = useCallback(() => router.back(), [router]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return {
    reps,
    series,
    isRunning,
    togglePause,
    elapsedFormatted: formatTime(elapsedSeconds),
    currentFeedback,
    steps: db.steps,
    sessionFinished,
    finishSession,
    exerciseName,
    muscle,
    // Datos de pose en tiempo real
    sendFrame,
    connected,
    landmarks,
    angles,
    wsStatus,
    evaluatorKey: evaluatorKey ?? 'default',
  };
}
