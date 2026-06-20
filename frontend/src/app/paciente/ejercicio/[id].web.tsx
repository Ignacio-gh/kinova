import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEjercicioSesion } from '@/hooks/use-ejercicio-sesion';
import { PoseSkeletonOverlay } from '@/components/PoseSkeletonOverlay';
import { useIsMobileBrowser } from '@/hooks/use-mobile-browser';
import MobileEjercicio from './[id].tsx';

// ─── Componente de cámara web ─────────────────────────────────────────────────

function WebCamera({
  onError,
  captureRef,
  onVideoReady,
}: {
  onError: (msg: string) => void;
  captureRef: { current: (() => string | null) | null };
  onVideoReady: (w: number, h: number) => void;
}) {
  const containerRef = useRef<View>(null);
  const videoRef     = useRef<HTMLVideoElement | null>(null);
  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const streamRef    = useRef<MediaStream | null>(null);

  useEffect(() => {
    let video: HTMLVideoElement | null = null;
    let canvas: HTMLCanvasElement | null = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;

        video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay    = true;
        video.playsInline = true;
        video.muted       = true;
        video.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
        videoRef.current = video;

        const node = containerRef.current as unknown as HTMLDivElement | null;
        node?.appendChild(video);

        video.addEventListener('loadedmetadata', () => {
          onVideoReady(video!.videoWidth || 640, video!.videoHeight || 480);
        }, { once: true });

        canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        canvasRef.current = canvas;

        // Frame completo → MediaPipe tiene contexto de todo el cuerpo.
        // El overlay aplica la misma transformada object-fit:cover.
        captureRef.current = () => {
          const v = videoRef.current;
          const c = canvasRef.current;
          if (!v || !c || v.readyState < 2) return null;
          const ctx = c.getContext('2d');
          if (!ctx) return null;
          c.width  = v.videoWidth  || 640;
          c.height = v.videoHeight || 480;
          ctx.drawImage(v, 0, 0, c.width, c.height);
          return c.toDataURL('image/jpeg', 0.75).split(',')[1] ?? null;
        };
      } catch (err: unknown) {
        const name = (err as { name?: string })?.name ?? '';
        const denied = name === 'NotAllowedError' || name === 'PermissionDeniedError';
        onError(
          denied
            ? 'Permiso denegado. Habilitá la cámara en la configuración del navegador.'
            : 'No se encontró ninguna cámara disponible.',
        );
      }
    };

    startCamera();

    return () => {
      video?.remove();
      canvas?.remove();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      captureRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View ref={containerRef} style={StyleSheet.absoluteFill} />;
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function EjercicioSesionWeb() {
  const isMobile = useIsMobileBrowser();
  if (isMobile) return <MobileEjercicio />;
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string; muscle: string; reps: string; series: string;
    angleMin: string; angleMax: string;
  }>();

  const name         = params.name    ?? 'Ejercicio';
  const muscle       = params.muscle  ?? '';
  const targetReps   = Number(params.reps    ?? 10);
  const targetSeries = Number(params.series  ?? 3);
  const angleMin     = params.angleMin ? Number(params.angleMin) : null;
  const angleMax     = params.angleMax ? Number(params.angleMax) : null;

  const [cameraError, setCameraError]     = useState<string | null>(null);
  const [cameraPanelSize, setCameraPanelSize] = useState({ width: 0, height: 0 });
  const [videoSize, setVideoSize]         = useState({ width: 640, height: 480 });
  const captureRef       = useRef<(() => string | null) | null>(null);
  const alarmRef         = useRef<HTMLAudioElement | null>(null);
  const lastAlarmTs      = useRef(0);
  const skeletonReadyTs  = useRef(0); // timestamp en que el skeleton apareció por primera vez

  useEffect(() => {
    alarmRef.current = new Audio('/alarm.mp3');
    alarmRef.current.volume = 0.6;
    return () => { alarmRef.current = null; };
  }, []);

  const {
    reps, series, isRunning, togglePause, elapsedFormatted,
    sessionFinished, finishSession,
    sendFrame, connected, landmarks, angles, rawCorrections, evaluatorKey,
  } = useEjercicioSesion(name, muscle, targetReps, targetSeries, angleMin, angleMax);

  // Correcciones client-side: el backend solo las genera si angle_min/max están
  // configurados en la sesión. Este fallback replica la misma lógica para que
  // el skeleton cambie de color siempre que haya límites configurados.
  const computedCorrections = useMemo(() => {
    if (!angles || (angleMin === null && angleMax === null)) return [];
    const result: Array<{ joint: string; message: string; severity: string }> = [];
    if (angles.knee !== undefined) {
      const a       = Math.round(angles.knee);
      const flexion = Math.round(180 - a);
      // angleMax es el ángulo real máximo permitido (ej: 160°) — "se pasa"
      if (angleMax !== null && a > angleMax)
        result.push({ joint: 'rodilla', severity: 'error',   message: `Ángulo ${a}° supera el máximo de ${angleMax}°` });
      // angleMin es el objetivo de flexión a alcanzar (ej: 40°) — "no llega al mínimo"
      else if (angleMin !== null && flexion > angleMin)
        result.push({ joint: 'rodilla', severity: 'warning', message: `Flexión ${flexion}° > mín ${angleMin}°` });
    }
    if (angles.hip !== undefined) {
      const elev = Math.round(180 - angles.hip);
      if (angleMax !== null && elev > angleMax)
        result.push({ joint: 'cadera', severity: 'error',   message: `Elevación ${elev}° > máx ${angleMax}°` });
      else if (angleMin !== null && elev < angleMin)
        result.push({ joint: 'cadera', severity: 'warning', message: `Elevación ${elev}° < mín ${angleMin}°` });
    }
    return result;
  }, [angles, angleMin, angleMax]);

  const effectiveCorrections = rawCorrections.length > 0 ? rawCorrections : computedCorrections;

  // Landmarks persistentes: el skeleton no desaparece entre frames.
  // Se limpia tras 1.5 s sin detección para que al re-entrar no haya estado EMA viejo.
  const [stableLandmarks, setStableLandmarks] = useState<typeof landmarks>(null);
  const [stableAngles, setStableAngles]       = useState<typeof angles>(null);
  const staleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!landmarks || Object.keys(landmarks).length === 0) {
      if (!staleTimerRef.current) {
        staleTimerRef.current = setTimeout(() => {
          setStableLandmarks(null);
          staleTimerRef.current = null;
        }, 1500);
      }
      return;
    }
    if (staleTimerRef.current) {
      clearTimeout(staleTimerRef.current);
      staleTimerRef.current = null;
    }
    setStableLandmarks(landmarks);
    if (angles) setStableAngles(angles);
  }, [landmarks, angles]);

  // Suena la alarma solo cuando: las articulaciones clave son visibles + ángulo supera el máximo (error), máx 1 vez cada 4 s.
  useEffect(() => {
    if (!isRunning || !stableLandmarks) return;
    // Verificar que cadera, rodilla y tobillo sean visibles (v > 0.3) en al menos un lado
    const leftVisible  = ['23', '25', '27'].every((i) => (stableLandmarks[i]?.v ?? -1) > 0.3);
    const rightVisible = ['24', '26', '28'].every((i) => (stableLandmarks[i]?.v ?? -1) > 0.3);
    const skeletonVisible = leftVisible || rightVisible;
    if (!skeletonVisible) {
      skeletonReadyTs.current = 0;
      return;
    }
    const now = Date.now();
    // Registrar primera aparición del skeleton
    if (skeletonReadyTs.current === 0) skeletonReadyTs.current = now;
    // Período de gracia de 3 s desde que el skeleton apareció — evita sonar al encender la cámara
    if (now - skeletonReadyTs.current < 3000) return;
    const hasError = effectiveCorrections.some(
      (c) => c.severity === 'error' && c.joint !== 'sistema',
    );
    if (!hasError) return;
    if (now - lastAlarmTs.current < 4000) return;
    lastAlarmTs.current = now;
    if (alarmRef.current) {
      alarmRef.current.currentTime = 0;
      alarmRef.current.play().catch(() => {});
    }
  }, [effectiveCorrections, isRunning, stableLandmarks]);

  // Captura periódica de frames para el WebSocket
  useEffect(() => {
    if (!isRunning || !connected) return;
    const interval = setInterval(() => {
      const base64 = captureRef.current?.();
      if (base64) sendFrame(base64);
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, connected, sendFrame]);

  return (
    <View style={s.root}>
      <View
        style={s.cameraPanel}
        onLayout={(e) => setCameraPanelSize({
          width:  e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })}
      >
        {cameraError ? (
          <View style={s.cameraError}>
            <View style={s.errorIcon}>
              <Ionicons name="warning-outline" size={32} color="#F59E0B" />
            </View>
            <Text style={s.errorTitle}>No se pudo abrir la cámara</Text>
            <Text style={s.errorDesc}>{cameraError}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={() => setCameraError(null)} activeOpacity={0.8}>
              <Text style={s.retryBtnText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebCamera
            onError={setCameraError}
            captureRef={captureRef}
            onVideoReady={(w, h) => setVideoSize({ width: w, height: h })}
          />
        )}

        {/* Skeleton overlay */}
        {stableLandmarks && cameraPanelSize.width > 0 && (
          <PoseSkeletonOverlay
            landmarks={stableLandmarks}
            angles={angles ?? stableAngles ?? {}}
            corrections={effectiveCorrections}
            width={cameraPanelSize.width}
            height={cameraPanelSize.height}
            exerciseKey={evaluatorKey}
            frontCamera={false}
            videoSize={videoSize}
          />
        )}

        {/* Top bar: close */}
        <View style={s.topBar}>
          <TouchableOpacity style={s.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Serie + timer */}
        <View style={s.seriesBadge}>
          <Text style={s.seriesText}>Serie {series}/{targetSeries}</Text>
          <View style={s.dot} />
          <Text style={s.seriesText}>{elapsedFormatted}</Text>
        </View>

        {/* Estado de conexión */}
        <View style={s.connectionBadge}>
          <View style={[s.connectionDot, {
            backgroundColor: stableLandmarks ? '#00C896' : connected ? '#FACC15' : '#64748B',
          }]} />
          <Text style={s.connectionText}>
            {stableLandmarks ? 'Analizando' : connected ? 'Posicionarse de perfil…' : 'Sin análisis'}
          </Text>
        </View>

        {/* Controles: pausa (centro) + finalizar (derecha) */}
        <View style={s.bottomBar}>
          <View style={s.bottomSpacer} />
          <TouchableOpacity style={s.pauseBtn} onPress={togglePause} activeOpacity={0.8}>
            <Ionicons name={isRunning ? 'pause' : 'play'} size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={s.bottomRight}>
            <TouchableOpacity style={s.finishBtn} onPress={finishSession} activeOpacity={0.8}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
              <Text style={s.finishBtnText}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal sesión completada */}
      {sessionFinished && (
        <View style={s.finishedOverlay}>
          <View style={s.finishedCard}>
            <View style={s.finishedIcon}>
              <Ionicons name="trophy-outline" size={48} color="#00A896" />
            </View>
            <Text style={s.finishedTitle}>¡Sesión completada!</Text>
            <Text style={s.finishedDesc}>
              {targetReps} repeticiones × {targetSeries} series de {name}
            </Text>
            <TouchableOpacity style={s.finishedBtn} onPress={finishSession} activeOpacity={0.8}>
              <Text style={s.finishedBtnText}>Volver al inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, minHeight: '100vh' as any, backgroundColor: '#0A1628' },

  cameraPanel: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    position: 'relative',
    overflow: 'hidden',
  },

  // Top bar
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
  repLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  repValue: { color: '#FFFFFF', fontSize: 56, fontWeight: '800', lineHeight: 62 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 4,
  },

  // Serie + timer
  seriesBadge: {
    position: 'absolute', top: 100, left: 24,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  seriesText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },

  // Conexión
  connectionBadge: {
    position: 'absolute', top: 104, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14,
  },
  connectionDot:  { width: 7, height: 7, borderRadius: 4 },
  connectionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },

  // Bottom: pausa centrada + finalizar a la derecha
  bottomBar: {
    position: 'absolute', bottom: 32, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24,
  },
  bottomSpacer: { flex: 1 },
  pauseBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  bottomRight: { flex: 1, alignItems: 'flex-end' },
  finishBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,43,73,0.85)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  finishBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // Error de cámara
  cameraError: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  errorIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(245,158,11,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  errorTitle:    { color: '#FFFFFF', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  errorDesc:     { color: '#94A3B8', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    backgroundColor: '#00A896', borderRadius: 12,
    paddingHorizontal: 28, paddingVertical: 12, marginTop: 8,
  },
  retryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  // Modal finalizado
  finishedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center', justifyContent: 'center', padding: 40,
  },
  finishedCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 40,
    alignItems: 'center', maxWidth: 380, width: '100%',
  },
  finishedIcon: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#e5f7f5',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  finishedTitle: { color: '#002B49', fontSize: 26, fontWeight: '800', marginBottom: 8 },
  finishedDesc:  { color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 28 },
  finishedBtn: {
    backgroundColor: '#00A896', borderRadius: 12,
    paddingHorizontal: 40, paddingVertical: 14,
  },
  finishedBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
