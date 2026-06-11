import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEjercicioSesion, type PostureStatus } from '@/hooks/use-ejercicio-sesion';
import { PoseSkeletonOverlay } from '@/components/PoseSkeletonOverlay';

// ─── Paleta ───────────────────────────────────────────────────────────────────

const ANGLE_KEY_TO_JOINT: Record<string, string> = {
  knee: 'rodilla', hip: 'cadera', trunk: 'tronco',
};

function angleChipStyle(key: string, corrections: Array<{ joint: string; severity: string }>) {
  const joint = ANGLE_KEY_TO_JOINT[key];
  const hits  = joint ? corrections.filter(c => c.joint === joint) : [];
  if (hits.some(c => c.severity === 'error'))
    return { bg: '#FEF2F2', border: '#FECACA', text: '#EF4444' };
  if (hits.some(c => c.severity === 'warning'))
    return { bg: '#FFFBEB', border: '#FDE68A', text: '#F59E0B' };
  return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' };
}

const STATUS_COLOR: Record<PostureStatus, string> = {
  correct:   '#16A34A',
  warning:   '#F59E0B',
  incorrect: '#EF4444',
};
const STATUS_BG: Record<PostureStatus, string> = {
  correct:   'rgba(22,163,74,0.12)',
  warning:   'rgba(245,158,11,0.12)',
  incorrect: 'rgba(239,68,68,0.12)',
};
const STATUS_BORDER: Record<PostureStatus, string> = {
  correct:   'rgba(22,163,74,0.35)',
  warning:   'rgba(245,158,11,0.35)',
  incorrect: 'rgba(239,68,68,0.35)',
};
const STATUS_HEADER_BG: Record<PostureStatus, string> = {
  correct:   '#16A34A',
  warning:   '#F59E0B',
  incorrect: '#EF4444',
};
const STATUS_LABEL: Record<PostureStatus, string> = {
  correct:   '✓  ¡Postura Correcta!',
  warning:   '⚠  Necesita Mejorar',
  incorrect: '✕  Postura Incorrecta',
};

// ─── Componente de cámara web ─────────────────────────────────────────────────
// Expone captureRef.current() para capturar frames como base64

function WebCamera({
  onError,
  captureRef,
  onVideoReady,
}: {
  onError: (msg: string) => void;
  captureRef: React.MutableRefObject<(() => string | null) | null>;
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

        // Notificar dimensiones reales cuando estén disponibles (para la transformada del overlay)
        video.addEventListener('loadedmetadata', () => {
          onVideoReady(video!.videoWidth || 640, video!.videoHeight || 480);
        }, { once: true });

        canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        canvasRef.current = canvas;

        // Frame completo → MediaPipe tiene contexto de todo el cuerpo = mejor detección.
        // El overlay aplica la misma transformada object-fit:cover para alinear los landmarks.
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

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraPanelSize, setCameraPanelSize] = useState({ width: 0, height: 0 });
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });

  const captureRef = useRef<(() => string | null) | null>(null);

  const {
    reps, series, isRunning, togglePause, elapsedFormatted,
    currentFeedback, steps, sessionFinished, finishSession,
    sendFrame, connected, landmarks, angles, rawCorrections, evaluatorKey,
  } = useEjercicioSesion(name, muscle, targetReps, targetSeries, angleMin, angleMax);

  // ── Correcciones client-side ──
  // El backend solo genera correcciones si el ejercicio tiene angle_min/max en DB.
  // Este bloque las calcula directamente desde los ángulos recibidos para que
  // el skeleton y los chips cambien de color aunque no vengan del servidor.
  // El convenio es el mismo que usan los evaluadores: los valores son en grados
  // de FLEXIÓN (knee_extension, squat) o ELEVACIÓN (straight_leg_raise).
  const computedCorrections = useMemo(() => {
    if (!angles || (angleMin === null && angleMax === null)) return [];
    const result: Array<{ joint: string; message: string; severity: string }> = [];

    if (angles.knee !== undefined) {
      const flexion = Math.round(180 - angles.knee);
      if (angleMax !== null && flexion > angleMax) {
        result.push({ joint: 'rodilla', severity: 'error',
          message: `Flexión de rodilla ${flexion}° supera el máximo de ${angleMax}°` });
      } else if (angleMin !== null && flexion > angleMin) {
        result.push({ joint: 'rodilla', severity: 'warning',
          message: `Extendé más la pierna — flexión actual ${flexion}°, objetivo < ${angleMin}°` });
      }
    }
    if (angles.hip !== undefined) {
      const elevation = Math.round(180 - angles.hip);
      if (angleMax !== null && elevation > angleMax) {
        result.push({ joint: 'cadera', severity: 'error',
          message: `Elevación ${elevation}° supera el máximo de ${angleMax}°` });
      } else if (angleMin !== null && elevation < angleMin) {
        result.push({ joint: 'cadera', severity: 'warning',
          message: `Subí más la pierna — elevación actual ${elevation}°, objetivo > ${angleMin}°` });
      }
    }
    return result;
  }, [angles, angleMin, angleMax]);

  // Backend tiene prioridad; client-side es el fallback
  const effectiveCorrections = rawCorrections.length > 0 ? rawCorrections : computedCorrections;

  // Landmarks persistentes — el esqueleto no desaparece entre frames.
  // Si no llegan landmarks por 1.5 s (persona fuera de cámara), se limpia
  // para que al volver no haya estado EMA viejo y arranque con posición fresca.
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

  // ── Captura periódica de frames para el WebSocket (~3 fps) ──
  useEffect(() => {
    if (!isRunning || !connected) return;
    const interval = setInterval(() => {
      const base64 = captureRef.current?.();
      if (base64) sendFrame(base64);
    }, 100); // 10 fps — sendingRef garantiza no saturar el WS
    return () => clearInterval(interval);
  }, [isRunning, connected, sendFrame]);

  return (
    <View style={s.root}>
      {/* ══════════ LADO IZQUIERDO — cámara ══════════ */}
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
            <TouchableOpacity
              style={s.retryBtn}
              onPress={() => setCameraError(null)}
              activeOpacity={0.8}
            >
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

        {/* Skeleton overlay encima de la cámara */}
        {stableLandmarks && cameraPanelSize.width > 0 && (
          <PoseSkeletonOverlay
            landmarks={stableLandmarks}
            angles={angles ?? stableAngles ?? {}}
            width={cameraPanelSize.width}
            height={cameraPanelSize.height}
            exerciseKey={evaluatorKey}
            frontCamera={false}
            videoSize={videoSize}
          />
        )}

        {/* Indicador de conexión */}
        <View style={s.connectionBadge}>
          <View style={[s.connectionDot, {
            backgroundColor: stableLandmarks ? '#00C896' : connected ? '#FACC15' : '#64748B',
          }]} />
          <Text style={s.connectionText}>
            {stableLandmarks ? 'Analizando' : connected ? 'Posicionarse de perfil…' : 'Sin análisis'}
          </Text>
        </View>

        {/* Overlay superior: rep counter + cerrar */}
        <View style={s.topBar}>
          <View>
            <Text style={s.repLabel}>Repeticiones</Text>
            <Text style={s.repValue}>{reps}</Text>
          </View>
          <TouchableOpacity style={s.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Info de serie + timer */}
        <View style={s.seriesBadge}>
          <Text style={s.seriesText}>Serie {series}/{targetSeries}</Text>
          <View style={s.dot} />
          <Text style={s.seriesText}>{elapsedFormatted}</Text>
        </View>

        {/* Botón pausa */}
        <View style={s.controls}>
          <TouchableOpacity style={s.pauseBtn} onPress={togglePause} activeOpacity={0.8}>
            <Ionicons name={isRunning ? 'pause' : 'play'} size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ══════════ LADO DERECHO — panel de feedback ══════════ */}
      <View style={s.rightPanel}>
        {/* Header de estado — usa el peor status de todas las correcciones */}
        {(() => {
          const worstStatus = currentFeedback.some(f => f.status === 'incorrect')
            ? 'incorrect' as const
            : currentFeedback.some(f => f.status === 'warning')
              ? 'warning' as const
              : 'correct' as const;
          return (
            <View style={[s.statusHeader, { backgroundColor: STATUS_HEADER_BG[worstStatus] }]}>
              <Text style={s.statusHeaderText}>{STATUS_LABEL[worstStatus]}</Text>
            </View>
          );
        })()}

        <ScrollView
          style={s.rightScroll}
          contentContainerStyle={s.rightScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Pasos */}
          <Text style={s.sectionTitle}>Pasos a seguir</Text>
          {steps.map((step) => (
            <View key={step.number} style={s.stepRow}>
              <View style={s.stepNum}>
                <Text style={s.stepNumText}>{step.number}</Text>
              </View>
              <Text style={s.stepText}>{step.text}</Text>
            </View>
          ))}

          {/* Ángulos en tiempo real */}
          {angles && Object.keys(angles).length > 0 && (
            <>
              <Text style={[s.sectionTitle, { marginTop: 20 }]}>Ángulos en Tiempo Real</Text>
              <View style={s.anglesRow}>
                {Object.entries(angles).map(([k, v]) => {
                  const c = angleChipStyle(k, effectiveCorrections);
                  return (
                    <View key={k} style={[s.angleChip, { backgroundColor: c.bg, borderColor: c.border }]}>
                      <Text style={s.angleChipLabel}>{k}</Text>
                      <Text style={[s.angleChipValue, { color: c.text }]}>{Math.round(v)}°</Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* Feedback en tiempo real — muestra TODAS las correcciones */}
          <Text style={[s.sectionTitle, { marginTop: 20 }]}>Feedback en Tiempo Real</Text>
          {currentFeedback.map((fb, idx) => (
            <View key={idx} style={[
              s.feedbackCard,
              {
                backgroundColor: STATUS_BG[fb.status],
                borderColor:     STATUS_BORDER[fb.status],
                marginBottom: 8,
              },
            ]}>
              <View style={s.feedbackCardTop}>
                <View style={[s.feedbackDot, { backgroundColor: STATUS_COLOR[fb.status] }]} />
                <Text style={[s.feedbackStatus, { color: STATUS_COLOR[fb.status] }]}>
                  {fb.status === 'correct'
                    ? 'CORRECTO'
                    : fb.status === 'warning'
                    ? 'ATENCIÓN'
                    : 'INCORRECTO'}
                </Text>
              </View>
              <Text style={s.feedbackMessage}>{fb.message}</Text>
            </View>
          ))}

          {/* Leyenda */}
          <View style={s.legendSection}>
            {(
              [
                { status: 'correct'   as PostureStatus, label: 'Postura Perfecta' },
                { status: 'warning'   as PostureStatus, label: 'Necesita Mejorar' },
                { status: 'incorrect' as PostureStatus, label: 'Postura Incorrecta' },
              ]
            ).map(({ status, label }) => (
              <View key={status} style={s.legendRow}>
                <View style={[s.legendDot, { backgroundColor: STATUS_COLOR[status] }]} />
                <Text style={s.legendText}>{label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Finalizar */}
        <View style={s.finishWrap}>
          <TouchableOpacity style={s.finishBtn} onPress={finishSession} activeOpacity={0.8}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
            <Text style={s.finishBtnText}>Finalizar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de sesión completada */}
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
  root: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any, backgroundColor: '#0A1628' },

  // Panel cámara
  cameraPanel: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    position: 'relative',
    overflow: 'hidden',
  },

  connectionBadge: {
    position: 'absolute', top: 104, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14,
  },
  connectionDot:  { width: 7, height: 7, borderRadius: 4 },
  connectionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },

  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
  repLabel:  { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  repValue:  { color: '#FFFFFF', fontSize: 56, fontWeight: '800', lineHeight: 62 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 4,
  },
  seriesBadge: {
    position: 'absolute', top: 100, left: 24,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  seriesText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },
  controls: {
    position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center',
  },
  pauseBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },

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

  // Panel derecho
  rightPanel: { width: 340, backgroundColor: '#FFFFFF', flexDirection: 'column' },
  statusHeader: { paddingHorizontal: 20, paddingVertical: 18 },
  statusHeaderText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  rightScroll: { flex: 1 },
  rightScrollContent: { padding: 20, paddingBottom: 8 },
  sectionTitle: { color: '#002B49', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  stepNum: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#e5f7f5',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNumText: { color: '#00A896', fontSize: 12, fontWeight: '700' },
  stepText:    { color: '#374151', fontSize: 13, lineHeight: 20, flex: 1 },

  // Chips de ángulos
  anglesRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  angleChip: {
    backgroundColor: '#F0FDF4', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center',
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  angleChipLabel: { color: '#6B7280', fontSize: 11, fontWeight: '500', textTransform: 'capitalize' },
  angleChipValue: { color: '#16A34A', fontSize: 18, fontWeight: '800' },

  // Feedback card
  feedbackCard: { borderRadius: 12, padding: 14, borderWidth: 1.5, marginBottom: 4 },
  feedbackCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  feedbackDot:     { width: 8, height: 8, borderRadius: 4 },
  feedbackStatus:  { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  feedbackMessage: { color: '#1F2937', fontSize: 14, fontWeight: '500', lineHeight: 20 },

  // Leyenda
  legendSection: {
    marginTop: 18, gap: 10,
    borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16,
  },
  legendRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: '#1F2937', fontSize: 13, fontWeight: '600' },

  // Finalizar
  finishWrap: { padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  finishBtn: {
    backgroundColor: '#002B49', borderRadius: 12,
    paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  finishBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

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
