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

function wsFeedbackToItems(fb: PoseWSFeedback): FeedbackItem[] {
  const statusMap: Record<string, PostureStatus> = {
    perfect: 'correct',
    improve: 'warning',
    bad:     'incorrect',
  };
  const globalStatus: PostureStatus = statusMap[fb.status] ?? 'correct';

  if (fb.corrections.length === 0) {
    return [{ status: 'correct', message: '¡Postura correcta! Seguí así.' }];
  }

  // Devolver TODAS las correcciones, cada una con su severidad
  return fb.corrections.map((c) => {
    const st: PostureStatus = c.severity === 'error' ? 'incorrect' : 'warning';
    return { status: st, message: c.message };
  });
}

// ─── Mock data (fallback cuando el backend no está disponible) ────────────────

const EXERCISE_DB: Record<string, {
  steps: ExerciseStep[];
  feedbackCycle: FeedbackItem[];
}> = {
  sentadilla: {
    steps: [
      { number: 1, text: 'Posicionate de perfil a la cámara, pies al ancho de hombros' },
      { number: 2, text: 'Bajá como si te sentaras en una silla, llevando la cola hacia atrás' },
      { number: 3, text: 'Las rodillas deben seguir la línea de los pies, sin colapsar hacia adentro' },
      { number: 4, text: 'Mantené el pecho elevado y la mirada al frente durante todo el movimiento' },
      { number: 5, text: 'Subí controlando, sin impulso — exhalá al subir, inhalá al bajar' },
    ],
    feedbackCycle: [
      { status: 'correct',   message: 'Buen rango de movimiento, seguí así' },
      { status: 'correct',   message: 'Postura del tronco correcta' },
      { status: 'warning',   message: 'Intentá bajar un poco más lento' },
      { status: 'correct',   message: 'Rodillas bien alineadas' },
      { status: 'incorrect', message: 'Llevá el pecho hacia arriba' },
      { status: 'correct',   message: 'Excelente control del movimiento' },
    ],
  },
  extension: {
    steps: [
      { number: 1, text: 'Sentate con la espalda bien apoyada en el respaldo' },
      { number: 2, text: 'Extendé la pierna lentamente hasta la posición horizontal' },
      { number: 3, text: 'Mantené 2 segundos en la extensión completa antes de bajar' },
      { number: 4, text: 'Bajá controlando el descenso — no sueltes de golpe' },
      { number: 5, text: 'Mantené el muslo apoyado en el asiento, no levantes la cola' },
    ],
    feedbackCycle: [
      { status: 'correct',   message: 'Extensión completa correcta' },
      { status: 'warning',   message: 'Estirá un poco más la pierna' },
      { status: 'correct',   message: 'Buen rango de movimiento' },
      { status: 'incorrect', message: 'Bajá más lento, controlá el descenso' },
      { status: 'correct',   message: 'Control del movimiento perfecto' },
      { status: 'warning',   message: 'Apoyá mejor la espalda en el respaldo' },
    ],
  },
  elevacion: {
    steps: [
      { number: 1, text: 'Acostate boca arriba con una pierna doblada y el pie apoyado' },
      { number: 2, text: 'Mantené la pierna de trabajo completamente estirada' },
      { number: 3, text: 'Subí la pierna lentamente hasta el ángulo indicado por tu kinesiólogo' },
      { number: 4, text: 'Mantené 2 segundos arriba y bajá controlando' },
      { number: 5, text: 'No levantes la cadera ni la espalda baja del piso' },
    ],
    feedbackCycle: [
      { status: 'correct',   message: 'Buena elevación, rodilla estirada' },
      { status: 'warning',   message: 'Mantené la rodilla bien estirada' },
      { status: 'correct',   message: 'Rango de movimiento correcto' },
      { status: 'incorrect', message: 'Rodilla doblándose, estirá más' },
      { status: 'correct',   message: 'Excelente control de la pierna' },
    ],
  },
  default: {
    steps: [
      { number: 1, text: 'Posicionate de perfil a la cámara' },
      { number: 2, text: 'Realizá el movimiento de forma lenta y controlada' },
      { number: 3, text: 'Respetá el rango de movimiento indicado' },
      { number: 4, text: 'Controlá la respiración durante el ejercicio' },
      { number: 5, text: 'Si sentís dolor, detenete inmediatamente' },
    ],
    feedbackCycle: [
      { status: 'correct',   message: 'Buena postura general' },
      { status: 'correct',   message: 'Seguí así, muy bien' },
      { status: 'warning',   message: 'Controlá la velocidad del movimiento' },
      { status: 'correct',   message: 'Rango de movimiento adecuado' },
      { status: 'incorrect', message: 'Corregí la alineación del cuerpo' },
      { status: 'correct',   message: 'Excelente ejecución' },
    ],
  },
};

function resolveExerciseKey(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('sentadilla')) return 'sentadilla';
  if (lower.includes('extensi'))    return 'extension';
  if (lower.includes('elevaci') || lower.includes('pierna recta') || lower.includes('slr'))
    return 'elevacion';
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

  // ── Acumulador de correcciones a lo largo de la sesión ──
  // Cuenta cuántas veces apareció cada corrección. Al finalizar mostramos
  // las más frecuentes como feedback resumido. Esto es la solución
  // pragmática mientras el pipeline en tiempo real es lento en móvil.
  type CorrectionStat = { message: string; severity: string; joint: string; count: number };
  const correctionsHistoryRef = useRef<Map<string, CorrectionStat>>(new Map());
  const [summaryCorrections, setSummaryCorrections] = useState<CorrectionStat[]>([]);

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

  // ── Acumular correcciones del WS para el resumen final ──
  useEffect(() => {
    if (!feedback?.corrections || feedback.corrections.length === 0) return;
    const hist = correctionsHistoryRef.current;
    for (const c of feedback.corrections) {
      // Ignorar mensajes de sistema (no son correcciones reales del paciente)
      if (c.joint === 'sistema') continue;
      const existing = hist.get(c.message);
      if (existing) {
        existing.count += 1;
      } else {
        hist.set(c.message, {
          message: c.message,
          severity: c.severity,
          joint: c.joint,
          count: 1,
        });
      }
    }
  }, [feedback]);

  // ── Cuando la sesión termina, calcular el top de correcciones ──
  useEffect(() => {
    if (!sessionFinished) return;
    const all = Array.from(correctionsHistoryRef.current.values());
    // Ordenar: primero errores (severity='error'), después warnings; por count desc
    const top = all
      .sort((a, b) => {
        const aErr = a.severity === 'error' ? 1 : 0;
        const bErr = b.severity === 'error' ? 1 : 0;
        if (aErr !== bErr) return bErr - aErr;
        return b.count - a.count;
      })
      .slice(0, 5);
    setSummaryCorrections(top);
  }, [sessionFinished]);

  // ── Valores derivados ──

  // Reps y series actuales (real o mock)
  const reps = connected && feedback
    ? feedback.total_reps % targetReps
    : mockReps;

  const series = connected && feedback
    ? Math.min(Math.floor(feedback.total_reps / targetReps) + 1, targetSeries)
    : mockSeries;

  // Feedback de postura (real o mock) — ahora es un array con TODAS las correcciones
  const currentFeedback: FeedbackItem[] = connected && feedback
    ? wsFeedbackToItems(feedback)
    : [db.feedbackCycle[mockFeedbackIndex]];

  // Correcciones crudas del backend (para colorear el skeleton por segmento)
  const rawCorrections = connected && feedback ? feedback.corrections : [];

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

  // ── Cerrar sesión = mostrar resumen primero ──
  // Si el modal ya está abierto, salimos. Si no, lo abrimos y se mostrará
  // el feedback acumulado (incluso si no completaste todas las reps).
  const finishSession = useCallback(() => {
    if (sessionFinished) {
      router.back();
    } else {
      setIsRunning(false);
      setSessionFinished(true);
    }
  }, [router, sessionFinished]);

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
    rawCorrections,
    evaluatorKey: evaluatorKey ?? 'default',
    // Resumen de correcciones para el modal de fin de sesión
    summaryCorrections,
  };
}
