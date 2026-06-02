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

export function usePoseWebSocket(evaluatorKey: string | null, enabled: boolean) {
  const wsRef = useRef<WebSocket | null>(null);
  const [feedback, setFeedback] = useState<PoseWSFeedback | null>(null);
  const [connected, setConnected] = useState(false);
  const sendingRef = useRef(false);
  const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!evaluatorKey || !enabled) return;

    const wsBase = BASE_URL.replace(/^https/, 'wss').replace(/^http(?!s)/, 'ws');
    const url = `${wsBase}/api/v1/pose/ws/${evaluatorKey}`;
    console.log('[PoseWS] conectando a', url);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[PoseWS] conectado');
      setConnected(true);
    };
    ws.onmessage = (event) => {
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
        sendTimeoutRef.current = null;
      }
      try {
        setFeedback(JSON.parse(event.data) as PoseWSFeedback);
      } catch {
        // ignorar frames malformados
      } finally {
        sendingRef.current = false;
      }
    };
    ws.onclose = (e) => {
      console.log('[PoseWS] desconectado', e.code, e.reason);
      setConnected(false);
      sendingRef.current = false;
    };
    ws.onerror = () => {
      console.warn('[PoseWS] error de conexión. URL usada:', url);
      setConnected(false);
      sendingRef.current = false;
    };

    return () => {
      ws.close();
      wsRef.current = null;
      sendingRef.current = false;
    };
  }, [evaluatorKey, enabled]);

  const sendFrame = useCallback((base64: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && !sendingRef.current) {
      sendingRef.current = true;

      // Timeout de seguridad: si el backend no responde en 3s, liberamos el bloqueo
      // para que el siguiente frame pueda enviarse (evita deadlock).
      if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
      sendTimeoutRef.current = setTimeout(() => {
        sendingRef.current = false;
      }, 3000);

      wsRef.current.send(JSON.stringify({ frame: base64 }));
    }
  }, []);

  return { feedback, connected, sendFrame };
}
