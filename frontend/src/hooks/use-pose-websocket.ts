import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ─── URL del backend ───────────────────────────────────────────────────────────
// Si hay EXPO_PUBLIC_API_URL definida (ej. en .env) se usa esa.
// Si no, en web usa localhost. En móvil extrae la IP de la PC desde
// el manifest de Expo (Constants.expoConfig.hostUri = "192.168.x.x:8081")
// y asume que el backend corre en el mismo host pero en el puerto 8000.

function getBackendUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'web') {
    return 'http://localhost:8000';
  }
  // En Expo Go, hostUri = "192.168.x.x:8081"
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as unknown as { manifest?: { debuggerHost?: string } }).manifest?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0]; // solo la IP, sin el puerto
    return `http://${host}:8000`;
  }
  return 'http://localhost:8000';
}

const BASE_URL = getBackendUrl();

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type PoseLandmark = { x: number; y: number; v: number };

export type PoseWSFeedback = {
  status: 'perfect' | 'improve' | 'bad';
  corrections: Array<{ joint: string; message: string; severity: string }>;
  angles: Record<string, number>;
  landmarks: Record<string, PoseLandmark>;
  rep_counted: boolean;
  total_reps: number;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

// Mínimo intervalo entre frames enviados (ms). El backend lite+sin-CLAHE procesa
// en ~100-150ms. Enviamos cada 80ms para mantener la pipe llena sin acumular cola.
const MIN_SEND_INTERVAL_MS = 80;

export function usePoseWebSocket(
  evaluatorKey: string | null,
  enabled: boolean,
  angleMin: number | null = null,
  angleMax: number | null = null,
) {
  const wsRef = useRef<WebSocket | null>(null);
  const [feedback, setFeedback] = useState<PoseWSFeedback | null>(null);
  const [connected, setConnected] = useState(false);
  const lastSentRef = useRef<number>(0);
  const inFlightRef = useRef(0);

  useEffect(() => {
    if (!evaluatorKey || !enabled) {
      return;
    }

    const wsBase = BASE_URL.replace(/^https/, 'wss').replace(/^http(?!s)/, 'ws');
    const qp = new URLSearchParams();
    if (angleMin != null) qp.set('angle_min', String(angleMin));
    if (angleMax != null) qp.set('angle_max', String(angleMax));
    const qs = qp.toString();
    const url = `${wsBase}/api/v1/pose/ws/${evaluatorKey}${qs ? `?${qs}` : ''}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;
    inFlightRef.current = 0;

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      inFlightRef.current = Math.max(0, inFlightRef.current - 1);
      try {
        const parsed = JSON.parse(event.data) as PoseWSFeedback;
        setFeedback(parsed);
      } catch {
        // ignorar frames malformados
      }
    };

    ws.onclose = () => {
      setConnected(false);
      inFlightRef.current = 0;
    };

    ws.onerror = () => {
      console.warn('[PoseWS] error de conexión. URL usada:', url);
      setConnected(false);
      inFlightRef.current = 0;
    };

    return () => {
      ws.close();
      wsRef.current = null;
      inFlightRef.current = 0;
    };
  }, [evaluatorKey, enabled, angleMin, angleMax]);

  const sendFrame = useCallback((base64: string) => {
    const ws = wsRef.current;
    if (ws?.readyState !== WebSocket.OPEN) return;

    const now = Date.now();
    const elapsed = now - lastSentRef.current;

    // Throttle: no enviar más rápido que MIN_SEND_INTERVAL_MS
    // y no acumular más de 2 frames en vuelo (evita latencia acumulada)
    if (elapsed < MIN_SEND_INTERVAL_MS || inFlightRef.current >= 2) return;

    lastSentRef.current = now;
    inFlightRef.current += 1;
    ws.send(JSON.stringify({ frame: base64 }));
  }, []);

  return { feedback, connected, sendFrame };
}
