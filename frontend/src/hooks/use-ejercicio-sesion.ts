import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';

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

export type ExerciseInfo = {
  name: string;
  muscle: string;
  targetReps: number;
  targetSeries: number;
  steps: ExerciseStep[];
  feedbackCycle: FeedbackItem[];
};

// ─── Mock data (el backend real reemplazará esto con análisis de pose) ────────

const DEFAULT_STEPS: ExerciseStep[] = [
  { number: 1, text: 'Mantén la espalda recta en todo momento' },
  { number: 2, text: 'Bajá lentamente y de forma controlada' },
  { number: 3, text: 'No bloquees las rodillas en la extensión' },
  { number: 4, text: 'Mantén el peso en el talón delantero' },
  { number: 5, text: 'Controlá la respiración durante el movimiento' },
];

const EXERCISE_DB: Record<string, Omit<ExerciseInfo, 'name' | 'muscle' | 'targetReps' | 'targetSeries'>> = {
  sentadilla: {
    steps: DEFAULT_STEPS,
    feedbackCycle: [
      { status: 'correct', message: 'Alineá la rodilla con el tobillo' },
      { status: 'correct', message: 'Espalda recta, ¡excelente!' },
      { status: 'warning', message: 'Bajá un poco más lento' },
      { status: 'correct', message: 'Rango de movimiento correcto' },
      { status: 'incorrect', message: 'Rodilla doblando hacia adentro' },
      { status: 'correct', message: 'Postura general correcta' },
      { status: 'warning', message: 'Mantené el core activo' },
      { status: 'correct', message: '¡Excelente serie!' },
    ],
  },
  extension: {
    steps: [
      { number: 1, text: 'Sentate con la espalda apoyada en el respaldo' },
      { number: 2, text: 'Extendé la pierna hasta la posición horizontal' },
      { number: 3, text: 'Mantén 2 segundos en la extensión completa' },
      { number: 4, text: 'Bajá controlando el movimiento' },
      { number: 5, text: 'No soltés el peso de golpe' },
    ],
    feedbackCycle: [
      { status: 'correct', message: 'Extensión completa correcta' },
      { status: 'warning', message: 'Extendé un poco más la rodilla' },
      { status: 'correct', message: 'Mantené ese rango de movimiento' },
      { status: 'incorrect', message: 'Velocidad muy alta en el descenso' },
      { status: 'correct', message: 'Control excéntrico perfecto' },
      { status: 'warning', message: 'Apoyá mejor la espalda' },
    ],
  },
  default: {
    steps: DEFAULT_STEPS,
    feedbackCycle: [
      { status: 'correct', message: 'Buena postura general' },
      { status: 'correct', message: 'Seguí así, muy bien' },
      { status: 'warning', message: 'Controlá la velocidad del movimiento' },
      { status: 'correct', message: 'Rango de movimiento adecuado' },
      { status: 'incorrect', message: 'Corregí la alineación del tronco' },
      { status: 'correct', message: '¡Excelente ejecución!' },
    ],
  },
};

function resolveExerciseKey(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('sentadilla')) return 'sentadilla';
  if (lower.includes('extensi')) return 'extension';
  return 'default';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEjercicioSesion(
  exerciseName: string,
  muscle: string,
  targetReps: number,
  targetSeries: number,
) {
  const router = useRouter();
  const key = resolveExerciseKey(exerciseName);
  const db = EXERCISE_DB[key];

  const [reps, setReps] = useState(0);
  const [series, setSeries] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  const feedbackCycle = db.feedbackCycle;
  const currentFeedback = feedbackCycle[feedbackIndex];

  // Reloj
  useEffect(() => {
    if (!isRunning || sessionFinished) return;
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, sessionFinished]);

  // Ciclo de feedback — simula análisis de pose cada 3 s
  useEffect(() => {
    if (!isRunning || sessionFinished) return;
    const id = setInterval(() => {
      setFeedbackIndex((i) => (i + 1) % feedbackCycle.length);
    }, 3000);
    return () => clearInterval(id);
  }, [isRunning, sessionFinished, feedbackCycle.length]);

  // Contador de repeticiones — simula detección de rep cada 5 s
  useEffect(() => {
    if (!isRunning || sessionFinished) return;
    const id = setInterval(() => {
      setReps((r) => {
        const next = r + 1;
        if (next >= targetReps) {
          if (series >= targetSeries) {
            setSessionFinished(true);
          } else {
            setSeries((s) => s + 1);
            return 0;
          }
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [isRunning, sessionFinished, targetReps, targetSeries, series]);

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
    targetReps,
    targetSeries,
    isRunning,
    togglePause,
    elapsedFormatted: formatTime(elapsedSeconds),
    currentFeedback,
    steps: db.steps,
    sessionFinished,
    finishSession,
    exerciseName,
    muscle,
  };
}
