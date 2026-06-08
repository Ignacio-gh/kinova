import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';
import { useEjercicioSesion, type PostureStatus } from '@/hooks/use-ejercicio-sesion';
import { PoseSkeletonOverlay } from '@/components/PoseSkeletonOverlay';

// ─── Paleta ───────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<PostureStatus, string> = {
  correct:   '#16A34A',
  warning:   '#F59E0B',
  incorrect: '#EF4444',
};
const STATUS_BG: Record<PostureStatus, string> = {
  correct:   'rgba(22,163,74,0.15)',
  warning:   'rgba(245,158,11,0.15)',
  incorrect: 'rgba(239,68,68,0.15)',
};
const STATUS_LABEL: Record<PostureStatus, string> = {
  correct:   '✓  ¡Postura Correcta!',
  warning:   '⚠  Necesita Mejorar',
  incorrect: '✕  Postura Incorrecta',
};
const STATUS_ICON: Record<PostureStatus, React.ComponentProps<typeof Ionicons>['name']> = {
  correct:   'checkmark-circle',
  warning:   'warning',
  incorrect: 'close-circle',
};

// ─── Pantalla de permisos ─────────────────────────────────────────────────────

function PermissionScreen({ onRequest }: { onRequest: () => void }) {
  return (
    <View style={p.root}>
      <View style={p.card}>
        <Ionicons name="camera-outline" size={52} color="#00A896" style={{ marginBottom: 16 }} />
        <Text style={p.title}>Acceso a la Cámara</Text>
        <Text style={p.desc}>
          Kinova necesita acceder a tu cámara para analizar tu postura y guiarte durante el ejercicio.
        </Text>
        <TouchableOpacity style={p.btn} onPress={onRequest} activeOpacity={0.8}>
          <Text style={p.btnText}>Habilitar Cámara</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const p = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A1628', alignItems: 'center', justifyContent: 'center', padding: 32 },
  card: { backgroundColor: '#0F2040', borderRadius: 20, padding: 32, alignItems: 'center', width: '100%' },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  desc: { color: '#94A3B8', fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  btn: { backgroundColor: '#00A896', borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14 },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function EjercicioSesion() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string; muscle: string; reps: string; series: string;
    angleMin: string; angleMax: string;
  }>();

  const name        = params.name     ?? 'Ejercicio';
  const muscle      = params.muscle   ?? '';
  const targetReps   = Number(params.reps    ?? 10);
  const targetSeries = Number(params.series  ?? 3);
  const angleMin     = params.angleMin ? Number(params.angleMin) : null;
  const angleMax     = params.angleMax ? Number(params.angleMax) : null;

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const {
    reps, series, isRunning, togglePause, elapsedFormatted,
    currentFeedback, steps, sessionFinished, finishSession,
    sendFrame, connected, landmarks, angles, wsStatus, rawCorrections, evaluatorKey,
  } = useEjercicioSesion(name, muscle, targetReps, targetSeries, angleMin, angleMax);

  // Dimensiones del contenedor de cámara para el overlay SVG
  const [cameraSize, setCameraSize] = useState({ width: 0, height: 0 });

  // Últimos landmarks y ángulos válidos — se muestran aunque el frame actual
  // no tenga detección (así el esqueleto no desaparece entre frames)
  const [stableLandmarks, setStableLandmarks] = useState<typeof landmarks>(null);
  const [stableAngles, setStableAngles]       = useState<typeof angles>(null);
  const [stableStatus, setStableStatus]       = useState<'perfect' | 'improve' | 'bad'>('perfect');
  const [stableCorrections, setStableCorrections] = useState<typeof rawCorrections>([]);
  useEffect(() => {
    if (landmarks && Object.keys(landmarks).length > 0) {
      setStableLandmarks(landmarks);
      if (angles)   setStableAngles(angles);
      if (wsStatus) setStableStatus(wsStatus);
      setStableCorrections(rawCorrections);
    }
  }, [landmarks, angles, wsStatus, rawCorrections]);

  // ── Captura silenciosa de frames via video (~1 fps) ──
  // Usamos recordAsync en lugar de takePictureAsync para evitar
  // el sonido del obturador en Android (que es a nivel sistema y
  // no se puede silenciar con props). La grabación de video no
  // emite ese sonido. Extraemos un frame del clip con VideoThumbnails.
  const capturingRef = useRef(false);

  const captureFrame = useCallback(async () => {
    if (capturingRef.current || !cameraRef.current) return;
    capturingRef.current = true;
    let videoUri: string | undefined;
    try {
      // Iniciar grabación silenciosa
      const recordingPromise = cameraRef.current.recordAsync({ maxDuration: 2 });

      // Detener después de 300 ms — suficiente para que Android inicialice
      await new Promise((r) => setTimeout(r, 300));
      cameraRef.current.stopRecording();

      const result = await recordingPromise;
      videoUri = result?.uri;
      if (!videoUri) return;

      // Extraer el primer frame del video
      const thumb = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 0,
        quality: 0.4,
      });
      if (!thumb?.uri) return;

      // Leer como base64 y enviar al backend
      const base64 = await FileSystem.readAsStringAsync(thumb.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      sendFrame(base64);
    } catch {
      // ignorar errores de captura puntual
    } finally {
      // Limpiar archivos temporales
      if (videoUri) FileSystem.deleteAsync(videoUri, { idempotent: true }).catch(() => {});
      capturingRef.current = false;
    }
  }, [sendFrame]);

  useEffect(() => {
    if (!isRunning || !connected) return;
    const interval = setInterval(captureFrame, 1200); // ~1 fps
    return () => clearInterval(interval);
  }, [isRunning, connected, captureFrame]);

  // ── Animación de pulso en el banner de estado ──
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  if (!permission)          return <View style={{ flex: 1, backgroundColor: '#0A1628' }} />;
  if (!permission.granted)  return <PermissionScreen onRequest={requestPermission} />;

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      {/* ── Cámara + Overlay ── */}
      <View
        style={s.cameraWrap}
        onLayout={(e) => setCameraSize({
          width:  e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })}
      >
        {/* Cámara trasera — los ejercicios se realizan de perfil */}
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          mute
          animateShutter={false}
        />

        {/* Esqueleto: se muestra con los últimos landmarks válidos
            para que no desaparezca entre frames */}
        {stableLandmarks && cameraSize.width > 0 && (
          <PoseSkeletonOverlay
            landmarks={stableLandmarks}
            angles={stableAngles ?? {}}
            status={stableStatus}
            corrections={stableCorrections}
            width={cameraSize.width}
            height={cameraSize.height}
            exerciseKey={evaluatorKey}
            frontCamera={false}
          />
        )}

        {/* Indicador de conexión y detección */}
        <View style={s.connectionBadge}>
          <View style={[s.connectionDot, {
            backgroundColor: stableLandmarks ? '#00C896' : connected ? '#FACC15' : '#64748B',
          }]} />
          <Text style={s.connectionText}>
            {stableLandmarks ? 'Analizando' : connected ? 'Posicionarse de perfil…' : 'Sin análisis'}
          </Text>
        </View>

        {/* Overlay superior: contador + timer + cerrar */}
        <View style={s.topOverlay}>
          <View style={s.repCounter}>
            <Text style={s.repLabel}>Repeticiones</Text>
            <Text style={s.repValue}>{reps}</Text>
            <Text style={s.repTarget}>de {targetReps}</Text>
          </View>

          <View style={s.seriesTimer}>
            <Text style={s.timerText}>{elapsedFormatted}</Text>
            <Text style={s.seriesText}>Serie {series}/{targetSeries}</Text>
          </View>

          <TouchableOpacity style={s.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Banner de estado — muestra la primera corrección */}
        {currentFeedback.length > 0 && (() => {
          const fb = currentFeedback[0];
          return (
            <Animated.View
              style={[
                s.statusBanner,
                {
                  backgroundColor: STATUS_BG[fb.status],
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Ionicons name={STATUS_ICON[fb.status]} size={18} color={STATUS_COLOR[fb.status]} />
              <Text style={[s.statusBannerText, { color: STATUS_COLOR[fb.status] }]}>
                {fb.message}
              </Text>
            </Animated.View>
          );
        })()}

        {/* Botón pausa */}
        <TouchableOpacity style={s.pauseBtn} onPress={togglePause} activeOpacity={0.8}>
          <Ionicons name={isRunning ? 'pause' : 'play'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Panel inferior ── */}
      <View style={s.panel}>
        {currentFeedback.length > 0 && (() => {
          const worstStatus = currentFeedback.some(f => f.status === 'incorrect')
            ? 'incorrect' as const
            : currentFeedback.some(f => f.status === 'warning')
              ? 'warning' as const
              : 'correct' as const;
          return (
            <View style={[s.postureHeader, { backgroundColor: STATUS_COLOR[worstStatus] }]}>
              <Ionicons name={STATUS_ICON[worstStatus]} size={18} color="#FFFFFF" />
              <Text style={s.postureHeaderText}>{STATUS_LABEL[worstStatus]}</Text>
            </View>
          );
        })()}

        <ScrollView style={s.panelScroll} showsVerticalScrollIndicator={false}>
          <Text style={s.sectionTitle}>Pasos a seguir</Text>
          {steps.map((step) => (
            <View key={step.number} style={s.stepRow}>
              <View style={s.stepNum}>
                <Text style={s.stepNumText}>{step.number}</Text>
              </View>
              <Text style={s.stepText}>{step.text}</Text>
            </View>
          ))}

          {/* Ángulos actuales (cuando hay análisis real) */}
          {angles && Object.keys(angles).length > 0 && (
            <>
              <Text style={[s.sectionTitle, { marginTop: 16 }]}>Ángulos en tiempo real</Text>
              <View style={s.anglesRow}>
                {Object.entries(angles).map(([k, v]) => (
                  <View key={k} style={s.angleChip}>
                    <Text style={s.angleChipLabel}>{k}</Text>
                    <Text style={s.angleChipValue}>{Math.round(v)}°</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={[s.sectionTitle, { marginTop: 16 }]}>Referencia</Text>
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

          <View style={{ height: 20 }} />
        </ScrollView>

        <TouchableOpacity style={s.finishBtn} onPress={finishSession} activeOpacity={0.8}>
          <Text style={s.finishBtnText}>Finalizar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de sesión completada */}
      {sessionFinished && (
        <View style={s.finishedOverlay}>
          <View style={s.finishedCard}>
            <View style={s.finishedIcon}>
              <Ionicons name="trophy-outline" size={40} color="#00A896" />
            </View>
            <Text style={s.finishedTitle}>¡Serie completada!</Text>
            <Text style={s.finishedDesc}>
              Completaste {targetReps} repeticiones × {targetSeries} series
            </Text>
            <TouchableOpacity style={s.finishedBtn} onPress={finishSession} activeOpacity={0.8}>
              <Text style={s.finishedBtnText}>Volver al inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A1628' },

  // Cámara
  cameraWrap: { flex: 1.4, position: 'relative', overflow: 'hidden' },
  topOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  repCounter: { flex: 1 },
  repLabel:   { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '500' },
  repValue:   { color: '#FFFFFF', fontSize: 42, fontWeight: '800', lineHeight: 48 },
  repTarget:  { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  seriesTimer: { alignItems: 'center', justifyContent: 'center' },
  timerText:  { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  seriesText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 12,
  },
  statusBanner: {
    position: 'absolute', bottom: 70, left: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  statusBannerText: { fontSize: 14, fontWeight: '600', flex: 1 },
  pauseBtn: {
    position: 'absolute', bottom: 16, alignSelf: 'center',
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    left: '50%', marginLeft: -26,
  },
  connectionBadge: {
    position: 'absolute', top: 88, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.50)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  connectionDot:  { width: 7, height: 7, borderRadius: 4 },
  connectionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },

  // Panel inferior
  panel:        { flex: 1, backgroundColor: '#FFFFFF' },
  postureHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  postureHeaderText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  panelScroll:  { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  sectionTitle: { color: '#002B49', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  stepRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  stepNum: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#e5f7f5',
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumText:  { color: '#00A896', fontSize: 12, fontWeight: '700' },
  stepText:     { color: '#374151', fontSize: 13, lineHeight: 20, flex: 1 },

  // Chips de ángulos
  anglesRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 6 },
  angleChip: {
    backgroundColor: '#F0FDF4', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center',
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  angleChipLabel: { color: '#6B7280', fontSize: 11, fontWeight: '500', textTransform: 'capitalize' },
  angleChipValue: { color: '#16A34A', fontSize: 18, fontWeight: '800' },

  legendRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  legendDot:    { width: 10, height: 10, borderRadius: 5 },
  legendText:   { color: '#374151', fontSize: 13, fontWeight: '600' },
  finishBtn: {
    margin: 16, backgroundColor: '#0A1628', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  finishBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // Modal finalizado
  finishedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  finishedCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 36,
    alignItems: 'center', width: '100%',
  },
  finishedIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#e5f7f5',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  finishedTitle:    { color: '#002B49', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  finishedDesc:     { color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  finishedBtn: {
    backgroundColor: '#00A896', borderRadius: 12,
    paddingHorizontal: 40, paddingVertical: 14,
  },
  finishedBtnText:  { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
