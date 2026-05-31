import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEjercicioSesion, type PostureStatus } from '@/hooks/use-ejercicio-sesion';

// ─── Paleta ───────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<PostureStatus, string> = {
  correct: '#16A34A',
  warning: '#F59E0B',
  incorrect: '#EF4444',
};
const STATUS_BG: Record<PostureStatus, string> = {
  correct: 'rgba(22,163,74,0.12)',
  warning: 'rgba(245,158,11,0.12)',
  incorrect: 'rgba(239,68,68,0.12)',
};
const STATUS_BORDER: Record<PostureStatus, string> = {
  correct: 'rgba(22,163,74,0.35)',
  warning: 'rgba(245,158,11,0.35)',
  incorrect: 'rgba(239,68,68,0.35)',
};
const STATUS_HEADER_BG: Record<PostureStatus, string> = {
  correct: '#16A34A',
  warning: '#F59E0B',
  incorrect: '#EF4444',
};
const STATUS_LABEL: Record<PostureStatus, string> = {
  correct: '✓  ¡Postura Correcta!',
  warning: '⚠  Necesita Mejorar',
  incorrect: '✕  Postura Incorrecta',
};

// ─── Componente de cámara web (acceso nativo a getUserMedia) ─────────────────

function WebCamera({ onError }: { onError: (msg: string) => void }) {
  const containerRef = useRef<View>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let video: HTMLVideoElement | null = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;

        video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;
        video.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';

        // RN Web expone el nodo DOM real en el ref
        const node = containerRef.current as unknown as HTMLDivElement | null;
        node?.appendChild(video);
      } catch (err: any) {
        const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError';
        onError(
          denied
            ? 'Permiso denegado. Habilitá la cámara para este sitio en la configuración del navegador.'
            : 'No se encontró ninguna cámara disponible.',
        );
      }
    };

    startCamera();

    return () => {
      video?.remove();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return <View ref={containerRef} style={StyleSheet.absoluteFill} />;
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function EjercicioSesionWeb() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string; muscle: string; reps: string; series: string;
  }>();

  const name = params.name ?? 'Ejercicio';
  const muscle = params.muscle ?? '';
  const targetReps = Number(params.reps ?? 10);
  const targetSeries = Number(params.series ?? 3);

  const [cameraError, setCameraError] = useState<string | null>(null);

  const {
    reps, series, isRunning, togglePause, elapsedFormatted,
    currentFeedback, steps, sessionFinished, finishSession,
  } = useEjercicioSesion(name, muscle, targetReps, targetSeries);

  return (
    <View style={s.root}>
      {/* ══════════ LADO IZQUIERDO — cámara ══════════ */}
      <View style={s.cameraPanel}>
        {/* Fondo siempre oscuro */}
        <View style={StyleSheet.absoluteFill} />

        {cameraError ? (
          /* Error de cámara */
          <View style={s.cameraError}>
            <View style={s.errorIcon}>
              <Ionicons name="warning-outline" size={32} color="#F59E0B" />
            </View>
            <Text style={s.errorTitle}>No se pudo abrir la cámara</Text>
            <Text style={s.errorDesc}>{cameraError}</Text>
            <TouchableOpacity
              style={s.retryBtn}
              onPress={() => { setCameraError(null); }}
              activeOpacity={0.8}
            >
              <Text style={s.retryBtnText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebCamera onError={setCameraError} />
        )}

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

        {/* Botón pausa centrado abajo */}
        <View style={s.controls}>
          <TouchableOpacity style={s.pauseBtn} onPress={togglePause} activeOpacity={0.8}>
            <Ionicons name={isRunning ? 'pause' : 'play'} size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ══════════ LADO DERECHO — panel de feedback ══════════ */}
      <View style={s.rightPanel}>
        {/* Header de estado */}
        <View style={[
          s.statusHeader,
          { backgroundColor: currentFeedback ? STATUS_HEADER_BG[currentFeedback.status] : '#16A34A' },
        ]}>
          <Text style={s.statusHeaderText}>
            {currentFeedback ? STATUS_LABEL[currentFeedback.status] : '✓  ¡Postura Correcta!'}
          </Text>
        </View>

        <ScrollView
          style={s.rightScroll}
          contentContainerStyle={s.rightScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Pasos a seguir */}
          <Text style={s.sectionTitle}>Pasos a seguir</Text>
          {steps.map((step) => (
            <View key={step.number} style={s.stepRow}>
              <View style={s.stepNum}>
                <Text style={s.stepNumText}>{step.number}</Text>
              </View>
              <Text style={s.stepText}>{step.text}</Text>
            </View>
          ))}

          {/* Feedback en tiempo real */}
          <Text style={[s.sectionTitle, { marginTop: 20 }]}>Feedback en Tiempo Real</Text>
          {currentFeedback && (
            <View style={[
              s.feedbackCard,
              {
                backgroundColor: STATUS_BG[currentFeedback.status],
                borderColor: STATUS_BORDER[currentFeedback.status],
              },
            ]}>
              <View style={s.feedbackCardTop}>
                <View style={[s.feedbackDot, { backgroundColor: STATUS_COLOR[currentFeedback.status] }]} />
                <Text style={[s.feedbackStatus, { color: STATUS_COLOR[currentFeedback.status] }]}>
                  {currentFeedback.status === 'correct'
                    ? 'CORRECTO'
                    : currentFeedback.status === 'warning'
                    ? 'ATENCIÓN'
                    : 'INCORRECTO'}
                </Text>
              </View>
              <Text style={s.feedbackMessage}>{currentFeedback.message}</Text>
            </View>
          )}

          {/* Leyenda */}
          <View style={s.legendSection}>
            {(
              [
                { status: 'correct' as PostureStatus, label: 'Postura Perfecta' },
                { status: 'warning' as PostureStatus, label: 'Necesita Mejorar' },
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

        {/* Botón finalizar */}
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
  seriesBadge: {
    position: 'absolute', top: 100, left: 24,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  seriesText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },
  controls: {
    position: 'absolute', bottom: 32, left: 0, right: 0,
    alignItems: 'center',
  },
  pauseBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },

  // Error de cámara
  cameraError: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 40, gap: 12,
  },
  errorIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(245,158,11,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  errorTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  errorDesc: { color: '#94A3B8', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    backgroundColor: '#00A896', borderRadius: 12,
    paddingHorizontal: 28, paddingVertical: 12, marginTop: 8,
  },
  retryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  // Panel derecho
  rightPanel: {
    width: 300,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  statusHeader: {
    paddingHorizontal: 20, paddingVertical: 18,
  },
  statusHeaderText: {
    color: '#FFFFFF', fontSize: 18, fontWeight: '800',
  },
  rightScroll: { flex: 1 },
  rightScrollContent: { padding: 20, paddingBottom: 8 },

  sectionTitle: {
    color: '#002B49', fontSize: 16, fontWeight: '700', marginBottom: 14,
  },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  stepNum: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#e5f7f5',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumText: { color: '#00A896', fontSize: 12, fontWeight: '700' },
  stepText: { color: '#374151', fontSize: 13, lineHeight: 20, flex: 1 },

  // Feedback card
  feedbackCard: {
    borderRadius: 12, padding: 14,
    borderWidth: 1.5,
    marginBottom: 4,
  },
  feedbackCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  feedbackDot: { width: 8, height: 8, borderRadius: 4 },
  feedbackStatus: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  feedbackMessage: { color: '#1F2937', fontSize: 14, fontWeight: '500', lineHeight: 20 },

  // Leyenda
  legendSection: {
    marginTop: 18, gap: 10,
    borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
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
  finishedDesc: { color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 28 },
  finishedBtn: {
    backgroundColor: '#00A896', borderRadius: 12,
    paddingHorizontal: 40, paddingVertical: 14,
  },
  finishedBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
