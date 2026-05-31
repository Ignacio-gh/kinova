import { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEjercicioSesion, type PostureStatus } from '@/hooks/use-ejercicio-sesion';

// ─── Colores ──────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<PostureStatus, string> = {
  correct: '#16A34A',
  warning: '#F59E0B',
  incorrect: '#EF4444',
};
const STATUS_BG: Record<PostureStatus, string> = {
  correct: 'rgba(22,163,74,0.15)',
  warning: 'rgba(245,158,11,0.15)',
  incorrect: 'rgba(239,68,68,0.15)',
};
const STATUS_LABEL: Record<PostureStatus, string> = {
  correct: '✓  ¡Postura Correcta!',
  warning: '⚠  Necesita Mejorar',
  incorrect: '✕  Postura Incorrecta',
};
const STATUS_ICON: Record<PostureStatus, React.ComponentProps<typeof Ionicons>['name']> = {
  correct: 'checkmark-circle',
  warning: 'warning',
  incorrect: 'close-circle',
};

// ─── Sub-componente: pantalla de permisos ─────────────────────────────────────

function PermissionScreen({ onRequest }: { onRequest: () => void }) {
  return (
    <View style={p.permRoot}>
      <View style={p.permCard}>
        <Ionicons name="camera-outline" size={52} color="#00A896" style={{ marginBottom: 16 }} />
        <Text style={p.permTitle}>Acceso a la Cámara</Text>
        <Text style={p.permDesc}>
          Kinova necesita acceder a tu cámara para analizar tu postura y guiarte durante el ejercicio.
        </Text>
        <TouchableOpacity style={p.permBtn} onPress={onRequest} activeOpacity={0.8}>
          <Text style={p.permBtnText}>Habilitar Cámara</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const p = StyleSheet.create({
  permRoot: { flex: 1, backgroundColor: '#0A1628', alignItems: 'center', justifyContent: 'center', padding: 32 },
  permCard: { backgroundColor: '#0F2040', borderRadius: 20, padding: 32, alignItems: 'center', width: '100%' },
  permTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  permDesc: { color: '#94A3B8', fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  permBtn: { backgroundColor: '#00A896', borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14 },
  permBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function EjercicioSesion() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string; muscle: string; reps: string; series: string;
  }>();

  const name = params.name ?? 'Ejercicio';
  const muscle = params.muscle ?? '';
  const targetReps = Number(params.reps ?? 10);
  const targetSeries = Number(params.series ?? 3);

  const [permission, requestPermission] = useCameraPermissions();

  const {
    reps, series, isRunning, togglePause, elapsedFormatted,
    currentFeedback, steps, sessionFinished, finishSession,
  } = useEjercicioSesion(name, muscle, targetReps, targetSeries);

  // Animación de pulso en el banner de estado
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  if (!permission) return <View style={{ flex: 1, backgroundColor: '#0A1628' }} />;
  if (!permission.granted) return <PermissionScreen onRequest={requestPermission} />;

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      {/* ── Cámara ── */}
      <View style={s.cameraWrap}>
        <CameraView style={StyleSheet.absoluteFill} facing="front" />

        {/* Overlay oscuro superior */}
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

        {/* Banner de estado sobre la cámara */}
        {currentFeedback && (
          <Animated.View
            style={[
              s.statusBanner,
              { backgroundColor: STATUS_BG[currentFeedback.status], transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Ionicons name={STATUS_ICON[currentFeedback.status]} size={18} color={STATUS_COLOR[currentFeedback.status]} />
            <Text style={[s.statusBannerText, { color: STATUS_COLOR[currentFeedback.status] }]}>
              {currentFeedback.message}
            </Text>
          </Animated.View>
        )}

        {/* Botón pausa */}
        <TouchableOpacity style={s.pauseBtn} onPress={togglePause} activeOpacity={0.8}>
          <Ionicons name={isRunning ? 'pause' : 'play'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Panel de feedback ── */}
      <View style={s.panel}>
        {/* Header de postura */}
        {currentFeedback && (
          <View style={[s.postureHeader, { backgroundColor: STATUS_COLOR[currentFeedback.status] }]}>
            <Ionicons name={STATUS_ICON[currentFeedback.status]} size={18} color="#FFFFFF" />
            <Text style={s.postureHeaderText}>{STATUS_LABEL[currentFeedback.status]}</Text>
          </View>
        )}

        <ScrollView style={s.panelScroll} showsVerticalScrollIndicator={false}>
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

          {/* Leyenda */}
          <Text style={[s.sectionTitle, { marginTop: 16 }]}>Referencia</Text>
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

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Botón finalizar */}
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
  repLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '500' },
  repValue: { color: '#FFFFFF', fontSize: 42, fontWeight: '800', lineHeight: 48 },
  repTarget: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  seriesTimer: { alignItems: 'center', justifyContent: 'center' },
  timerText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
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

  // Panel inferior
  panel: { flex: 1, backgroundColor: '#FFFFFF' },
  postureHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  postureHeaderText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  panelScroll: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  sectionTitle: { color: '#002B49', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  stepNum: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#e5f7f5',
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { color: '#00A896', fontSize: 12, fontWeight: '700' },
  stepText: { color: '#374151', fontSize: 13, lineHeight: 20, flex: 1 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: '#374151', fontSize: 13, fontWeight: '600' },
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
  finishedTitle: { color: '#002B49', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  finishedDesc: { color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  finishedBtn: {
    backgroundColor: '#00A896', borderRadius: 12,
    paddingHorizontal: 40, paddingVertical: 14,
  },
  finishedBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
