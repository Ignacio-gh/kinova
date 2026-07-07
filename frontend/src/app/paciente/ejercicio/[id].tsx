import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Modal, // <-- Agregá Modal acá
  PanResponder, useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
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
  const [showTips, setShowTips] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string; muscle: string; reps: string; series: string;
    angleMin: string; angleMax: string; evaluatorKey: string;
  }>();

  const name        = params.name     ?? 'Ejercicio';
  const muscle      = params.muscle   ?? '';
  const targetReps   = Number(params.reps    ?? 10);
  const targetSeries = Number(params.series  ?? 3);
  const angleMin     = params.angleMin ? Number(params.angleMin) : null;
  const angleMax     = params.angleMax ? Number(params.angleMax) : null;
  const evaluatorKeyParam = params.evaluatorKey || null;

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // ── Toggle frontal/trasera ──
  // Por default usamos la trasera (mejor para grabar el cuerpo de perfil)
  // pero el paciente debería poder cambiarla para verse a sí mismo.
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');

  const {
    reps, series, isRunning, togglePause, elapsedFormatted,
    currentFeedback, steps, sessionFinished, finishSession,
    sendFrame, connected, landmarks, angles, wsStatus, rawCorrections, evaluatorKey,
    summaryCorrections,
  } = useEjercicioSesion(name, muscle, targetReps, targetSeries, angleMin, angleMax, evaluatorKeyParam);

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

  // ── Captura de frames via foto (~2 fps) ──
  // takePictureAsync con base64:true no necesita permiso de micrófono
  // y es mucho más rápido (~100ms) que recordAsync (~300ms+).
  const capturingRef = useRef(false);

  const captureFrame = useCallback(async () => {
    if (capturingRef.current || !cameraRef.current) return;
    capturingRef.current = true;
    const t0 = Date.now();
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.15,            // calidad mínima para que MediaPipe procese rápido
        base64: true,
        skipProcessing: true,     // no rotar/procesar — usar la foto cruda
        exif: false,
        imageType: 'jpg',
        shutterSound: false,
      } as any);
      if (!photo?.base64) {
        console.warn('[Camera] foto sin base64');
        return;
      }
      const dt = Date.now() - t0;
      console.log(`[Camera] frame ${Math.round(photo.base64.length / 1024)}KB capturado en ${dt}ms`);
      sendFrame(photo.base64);
    } catch (err) {
      console.warn('[Camera] error capturando frame:', err);
    } finally {
      capturingRef.current = false;
    }
  }, [sendFrame]);

  useEffect(() => {
    if (!isRunning || !connected) return;
    // Intervalo bajo — el throttle real lo controla sendingRef en el WS
    // (no manda siguiente frame hasta recibir respuesta del anterior).
    const interval = setInterval(captureFrame, 200);
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

  // ── Panel de feedback deslizable — arrastrando el "grip" de arriba
  // se achica el panel y la cámara ocupa el espacio que va quedando libre. ──
  const { height: screenHeight } = useWindowDimensions();
  const MIN_PANEL_HEIGHT = 160;
  const MAX_PANEL_HEIGHT = screenHeight * 0.75;
  const DEFAULT_PANEL_HEIGHT = Math.min(
    MAX_PANEL_HEIGHT,
    Math.max(MIN_PANEL_HEIGHT, screenHeight * 0.42)
  );

  const panelHeight = useRef(new Animated.Value(DEFAULT_PANEL_HEIGHT)).current;
  const panelHeightRef = useRef(DEFAULT_PANEL_HEIGHT);
  const dragStartHeightRef = useRef(DEFAULT_PANEL_HEIGHT);

  useEffect(() => {
    const id = panelHeight.addListener(({ value }) => { panelHeightRef.current = value; });
    return () => panelHeight.removeListener(id);
  }, [panelHeight]);

  const panelPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
      onPanResponderGrant: () => {
        dragStartHeightRef.current = panelHeightRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        const next = Math.min(
          MAX_PANEL_HEIGHT,
          Math.max(MIN_PANEL_HEIGHT, dragStartHeightRef.current - gesture.dy)
        );
        panelHeight.setValue(next);
      },
    })
  ).current;

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
        {/* Cámara trasera por default — los ejercicios se realizan de perfil,
            pero el paciente puede dar vuelta a la frontal para verse a sí mismo */}
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={cameraFacing}
          mute
          animateShutter={false}
          pictureSize="640x480"
          enableTorch={false}
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
            frontCamera={cameraFacing === 'front'}
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

        {/* Botón cambiar cámara (frontal/trasera) */}
        <TouchableOpacity
          style={s.flipBtn}
          onPress={() => setCameraFacing((f) => (f === 'back' ? 'front' : 'back'))}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-reverse-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Panel inferior — arrastrable desde el grip ── */}
      <Animated.View style={[s.panel, { height: panelHeight }]}>
        <View style={s.gripHandleWrap} {...panelPanResponder.panHandlers}>
          <View style={s.gripHandle} />
        </View>

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

          <TouchableOpacity 
            style={s.helpBtn} 
            onPress={() => setShowTips(true)} 
            activeOpacity={0.7}
          >
            <Ionicons name="information-circle-outline" size={18} color="#00A896" />
            <Text style={s.helpBtnText}>¿Problemas con la cámara?</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>

        <TouchableOpacity style={s.finishBtn} onPress={finishSession} activeOpacity={0.8}>
          <Text style={s.finishBtnText}>Finalizar sesión</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* --- NUEVO MODAL DE TIPS --- */}
      {/* El Modal va a la misma altura que la vista final, pero fuera de la vista principal del Panel */}
      <Modal visible={showTips} transparent animationType="fade" onRequestClose={() => setShowTips(false)}>
        <View style={s.modalOverlay}>
          <View style={s.tipsCard}>
            <View style={s.tipsHeader}>
              <View style={s.tipsIconWrap}>
                <Ionicons name="help-buoy-outline" size={28} color="#00A896" />
              </View>
              <Text style={s.tipsTitle}>Tips de Detección</Text>
            </View>
            <Text style={s.tipsDesc}>
              Si la cámara no detecta tus movimientos, probá con lo siguiente:
            </Text>

            <View style={s.tipList}>
              <View style={s.tipItem}>
                <Ionicons name="sunny-outline" size={22} color="#F59E0B" />
                <Text style={s.tipText}>
                  Asegurate de estar en un lugar con <Text style={{fontWeight: '700'}}>buena iluminación</Text> para que la cámara te vea nítidamente.
                </Text>
              </View>

              <View style={s.tipItem}>
                <Ionicons name="shirt-outline" size={22} color="#3B82F6" />
                <Text style={s.tipText}>
                  Evitá ropa muy holgada. Tratá de usar ropa más ajustada o corta para que la IA <Text style={{fontWeight: '700'}}>detecte tus articulaciones</Text> con precisión.
                </Text>
              </View>

              <View style={s.tipItem}>
                <Ionicons name="scan-outline" size={22} color="#10B981" />
                <Text style={s.tipText}>
                  Acomodá el celular de forma estable a unos <Text style={{fontWeight: '700'}}>2 metros de distancia</Text>, de modo que tu cuerpo entero sea visible en el recuadro.
                </Text>
              </View>

              <View style={s.tipItem}>
                <Ionicons name="contrast-outline" size={22} color="#8B5CF6" />
                <Text style={s.tipText}>
                  Buscá un fondo liso. Que el color de tu ropa <Text style={{fontWeight: '700'}}>contraste con la pared</Text> ayuda muchísimo al sistema.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={s.closeTipsBtn} onPress={() => setShowTips(false)} activeOpacity={0.8}>
              <Text style={s.closeTipsText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* --------------------------- */}

      {/* Modal de sesión completada con resumen de correcciones */}
      {sessionFinished && (
        <View style={s.finishedOverlay}>
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.finishedCard}>
              <View style={s.finishedIcon}>
                <Ionicons name="trophy-outline" size={40} color="#00A896" />
              </View>
              <Text style={s.finishedTitle}>¡Serie completada!</Text>
              <Text style={s.finishedDesc}>
                Completaste {targetReps} repeticiones × {targetSeries} series en {elapsedFormatted}
              </Text>

              {/* Resumen de correcciones */}
              {summaryCorrections.length === 0 ? (
                <View style={s.summaryPerfectBox}>
                  <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
                  <Text style={s.summaryPerfectText}>
                    ¡Excelente ejecución! No detectamos errores significativos.
                  </Text>
                </View>
              ) : (
                <View style={s.summaryBox}>
                  <Text style={s.summaryTitle}>Para mejorar la próxima vez:</Text>
                  {summaryCorrections.map((c, idx) => {
                    const color = c.severity === 'error' ? '#EF4444' : '#F59E0B';
                    const bg = c.severity === 'error' ? '#FEF2F2' : '#FFFBEB';
                    const icon = c.severity === 'error' ? 'close-circle' : 'warning';
                    return (
                      <View key={idx} style={[s.summaryItem, { backgroundColor: bg }]}>
                        <Ionicons name={icon} size={18} color={color} />
                        <View style={{ flex: 1 }}>
                          <Text style={[s.summaryItemText, { color: '#0F172A' }]}>
                            {c.message}
                          </Text>
                          <Text style={s.summaryItemMeta}>
                            Detectado {c.count} {c.count === 1 ? 'vez' : 'veces'} · {c.joint}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              <TouchableOpacity style={s.finishedBtn} onPress={finishSession} activeOpacity={0.8}>
                <Text style={s.finishedBtnText}>Volver al inicio</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A1628' },

  // Cámara — flex:1 para que ocupe todo el espacio que el panel va liberando
  cameraWrap: { flex: 1, position: 'relative', overflow: 'hidden' },
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
  flipBtn: {
    position: 'absolute', bottom: 22, right: 20,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  connectionBadge: {
    position: 'absolute', top: 88, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.50)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  connectionDot:  { width: 7, height: 7, borderRadius: 4 },
  connectionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },

  // Panel inferior — la altura la controla panelHeight (drag del grip)
  panel:        { backgroundColor: '#FFFFFF' },
  gripHandleWrap: { alignItems: 'center', paddingVertical: 8 },
  gripHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB' },
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
  finishedDesc:     { color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  finishedBtn: {
    backgroundColor: '#00A896', borderRadius: 12,
    paddingHorizontal: 40, paddingVertical: 14,
    marginTop: 8,
  },
  finishedBtnText:  { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // Resumen de correcciones al finalizar la serie
  summaryBox: { width: '100%', marginBottom: 12 },
  summaryTitle: {
    color: '#0F172A', fontSize: 15, fontWeight: '700',
    marginBottom: 10, alignSelf: 'flex-start',
  },
  summaryItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderRadius: 12, padding: 12, marginBottom: 8,
  },
  summaryItemText: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  summaryItemMeta: {
    color: '#6B7280', fontSize: 11, marginTop: 2, textTransform: 'capitalize',
  },
  summaryPerfectBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F0FDF4', borderRadius: 12,
    padding: 14, marginBottom: 16, width: '100%',
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  summaryPerfectText: {
    color: '#15803D', fontSize: 13, fontWeight: '600',
    flex: 1, lineHeight: 18,
  },

  // --- Botón de Tips ---
  helpBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 24, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#e5f7f5', borderWidth: 1, borderColor: '#CCFBF1'
  },
  helpBtnText: { color: '#00A896', fontSize: 13, fontWeight: '700' },

  // --- Modal de Tips ---
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 22, 40, 0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 20,
    zIndex: 100,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28,
    width: '100%', maxWidth: 400,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  tipsHeader: { alignItems: 'center', marginBottom: 12 },
  tipsIconWrap: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#e5f7f5',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  tipsTitle: { color: '#002B49', fontSize: 20, fontWeight: '800' },
  tipsDesc: { color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  tipList: { gap: 16, marginBottom: 28 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  tipText: { color: '#374151', fontSize: 13, lineHeight: 20, flex: 1 },
  closeTipsBtn: {
    backgroundColor: '#0A1628', borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  closeTipsText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
