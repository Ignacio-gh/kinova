import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Modal,
  TextInput,
} from 'react-native';
import { SkeletonBox, SkeletonCard } from '@/components/ui/skeleton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { api } from '@/services/api';
import React from 'react';
import { useTutorial } from '@/context/TutorialContext';
import MockPatientDetail from '@/mock/mock-[id]';
import { useIsMobileBrowser } from '@/hooks/use-mobile-browser';
import MobilePatientDetail from './[id].tsx';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type RoutineExercise = {
  id: string;
  name: string;
  series: number;
  reps: number;
  angle?: string;
  muscle: string;
  completed: boolean;
};

type Patient = {
  id: string;
  name: string;
  diagnosis: string;
  period: string;
  adherence: number;
  status: 'Activo' | 'Finalizado';
  medicalNotes: string;
  durationWeeks: number;
};

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;
type Day = (typeof DAYS)[number];

const DAY_MAP: Record<string, Day> = {
  monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles',
  thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo',
};

function mapApiRoutine(w: Record<string, any[]>): Record<Day, RoutineExercise[]> {
  const mapped = Object.fromEntries(DAYS.map((d) => [d, []])) as Record<Day, RoutineExercise[]>;
  for (const [backendDay, items] of Object.entries(w)) {
    const day = DAY_MAP[backendDay];
    if (!day) continue;
    mapped[day] = items.map((r) => ({
      id: String(r.id),
      name: r.exercise.name,
      series: r.sets,
      reps: r.reps,
      angle: r.angle_min != null && r.angle_max != null ? `${r.angle_min}° - ${r.angle_max}°` : undefined,
      muscle: r.exercise.zone,
      completed: false,
    }));
  }
  return mapped;
}

function mapApiPatient(p: any): Patient {
  const start = p.treatment_start_date
    ? new Date(p.treatment_start_date).toLocaleDateString('es-AR') : '-';
  const end = p.treatment_start_date && p.treatment_weeks
    ? new Date(new Date(p.treatment_start_date).getTime() + p.treatment_weeks * 7 * 86400000).toLocaleDateString('es-AR')
    : '-';
  return {
    id: String(p.id),
    name: p.user.full_name,
    diagnosis: p.diagnosis,
    period: `${start} al ${end}`,
    adherence: Math.round(p.adherence_pct ?? 0),
    status: p.status === 'activo' ? 'Activo' : 'Finalizado',
    medicalNotes: p.notes ?? 'Sin notas clínicas.',
    durationWeeks: p.treatment_weeks ?? 0,
  };
}

// ─── Sub-componente ──────────────────────────────────────────────────────────

function CompactRoutineCard({
  exercise,
  cardId,
  statusId,
  onEdit,
  onDelete,
}: {
  exercise: RoutineExercise;
  cardId?: string;
  statusId?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={s.routineCard} nativeID={cardId}>
      <View style={s.cardTopHeader}>
        <Text style={s.cardExerciseName} numberOfLines={1}>{exercise.name}</Text>
        <View nativeID={statusId}>
          <Ionicons
            name={exercise.completed ? 'checkmark-circle' : 'close-circle-outline'}
            size={16}
            color={exercise.completed ? '#16A34A' : '#9CA3AF'}
          />
        </View>
      </View>
      <Text style={s.cardExerciseDetails}>
        {exercise.series}×{exercise.reps} reps
      </Text>
      {exercise.angle && exercise.angle !== '-' && (
        <Text style={s.cardAngle}>∢ {exercise.angle}</Text>
      )}
      <View style={s.cardBottomRow}>
        <View style={s.muscleTag}>
          <Text style={s.muscleTagText}>{exercise.muscle}</Text>
        </View>
        <View style={s.actionsRow}>
          <TouchableOpacity onPress={onEdit} hitSlop={6}>
            <Ionicons name="pencil-outline" size={14} color="#00A896" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} hitSlop={6}>
            <Ionicons name="trash-outline" size={14} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function PatientDetailWeb() {
  const isMobile = useIsMobileBrowser();
  if (isMobile) return <MobilePatientDetail />;
  const { isTutorialActive } = useTutorial();

  if (isTutorialActive) {
    return <MockPatientDetail />;
  }

  const router = useRouter();

  const {
    id,
    newExerciseName,
    newExerciseDay,
    newExerciseSets,
    newExerciseReps,
    newExerciseMuscle,
    newExerciseAngle,
  } = useLocalSearchParams<any>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [weeks, setWeeks] = useState(0);
  const [routine, setRoutine] = useState<Record<Day, RoutineExercise[]>>(
    Object.fromEntries(DAYS.map((d) => [d, []])) as Record<Day, RoutineExercise[]>
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- ESTADOS PARA EL MODAL DE EDICIÓN ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<{ day: Day; exId: string } | null>(null);

  const [editName, setEditName] = useState('');
  const [editSets, setEditSets] = useState('');
  const [editReps, setEditReps] = useState('');
  const [editMinAngle, setEditMinAngle] = useState('');
  const [editMaxAngle, setEditMaxAngle] = useState('');

  const fetchRoutine = useCallback(async () => {
    if (!id) return;
    const w = await api.get<Record<string, any[]>>(`/api/v1/routines/patient/${id}`);
    setRoutine(mapApiRoutine(w));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get<any>(`/api/v1/patients/${id}`),
      api.get<Record<string, any[]>>(`/api/v1/routines/patient/${id}`),
    ])
      .then(([p, w]) => {
        const mapped = mapApiPatient(p);
        setPatient(mapped);
        setWeeks(mapped.durationWeeks);
        setRoutine(mapApiRoutine(w));
      })
      .catch((e) => setError(e.message ?? 'Error al cargar el paciente'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (newExerciseName && newExerciseDay) {
      fetchRoutine().catch(console.error);
      router.setParams({
        newExerciseName: '', newExerciseDay: '', newExerciseSets: '',
        newExerciseReps: '', newExerciseMuscle: '', newExerciseAngle: '',
      });
    }
  }, [newExerciseName, newExerciseDay]);

  // --- LÓGICA DE BORRADO ---
  const handleDeleteExercise = async (day: Day, exId: string) => {
    const confirmed = window.confirm('¿Estás seguro que querés borrar este ejercicio?');
    if (confirmed) {
      try {
        await api.delete(`/api/v1/routines/${exId}`);
        await fetchRoutine();
      } catch (e: any) {
        alert(e.message ?? 'Error al eliminar');
      }
    }
  };

  // --- LÓGICA DE APERTURA DE MODAL Y PARSEO DE ÁNGULOS ---
  const handleOpenEdit = (day: Day, ex: RoutineExercise) => {
    setEditingData({ day, exId: ex.id });
    setEditName(ex.name);
    setEditSets(ex.series.toString());
    setEditReps(ex.reps.toString());

    let min = '';
    let max = '';
    if (ex.angle && ex.angle !== '-') {
      const angleString = ex.angle.replace(/°/g, '');
      const parts = angleString.split('-');
      if (parts.length === 2) {
        min = parts[0].trim();
        max = parts[1].trim();
      }
    }
    setEditMinAngle(min);
    setEditMaxAngle(max);
    setIsEditModalOpen(true);
  };

  // --- LÓGICA DE GUARDADO DE EDICIÓN ---
  const handleSaveEdit = async () => {
    const confirmed = window.confirm('¿Estás seguro que querés editar este ejercicio?');
    if (confirmed && editingData) {
      try {
        await api.put(`/api/v1/routines/${editingData.exId}`, {
          sets: Number(editSets) || undefined,
          reps: Number(editReps) || undefined,
          angle_min: editMinAngle !== '' ? Number(editMinAngle) : null,
          angle_max: editMaxAngle !== '' ? Number(editMaxAngle) : null,
        });
        await fetchRoutine();
        setIsEditModalOpen(false);
      } catch (e: any) {
        alert(e.message ?? 'Error al guardar');
      }
    }
  };

  if (loading) {
    return (
      <View style={s.webRoot}>
        <WebSidebarKine />
        <View style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
          {/* Topbar skeleton */}
          <View style={{ paddingHorizontal: 36, paddingTop: 28, paddingBottom: 24, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <SkeletonBox width={80} height={80} radius={40} />
              <View style={{ gap: 10 }}>
                <SkeletonBox width={200} height={22} radius={6} />
                <SkeletonBox width={140} height={14} radius={5} delay={60} />
                <SkeletonBox width={100} height={24} radius={12} delay={100} />
              </View>
              <View style={{ marginLeft: 'auto' as any, flexDirection: 'row', gap: 24 }}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                    <SkeletonBox width={48} height={24} radius={6} delay={i * 60} />
                    <SkeletonBox width={60} height={11} radius={4} delay={i * 60 + 40} />
                  </View>
                ))}
              </View>
            </View>
          </View>
          {/* Body skeleton */}
          <ScrollView contentContainerStyle={{ padding: 36, flexDirection: 'row', gap: 24 }}>
            <View style={{ width: 280, gap: 16 }}>
              <SkeletonCard height={160} />
              <SkeletonCard height={120} delay={80} />
            </View>
            <View style={{ flex: 1, gap: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonBox key={i} width={70} height={34} radius={8} delay={i * 30} />
                ))}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {[0, 1, 2, 3].map((i) => (
                  <SkeletonCard key={i} height={120} delay={i * 60} style={{ minWidth: 200, flex: 1 }} />
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={s.webRoot}>
        <WebSidebarKine />
        <View style={s.centerView}>
          <Text style={s.emptyViewText}>{error || 'Paciente no encontrado'}</Text>
        </View>
      </View>
    );
  }

  const isActive = patient.status === 'Activo';
  const adherenceColor = patient.adherence >= 90 ? '#16A34A' : '#00A896';

  return (
    <View style={s.webRoot}>
      <WebSidebarKine />

      <SafeAreaView style={s.root}>
        <StatusBar style="dark" />

        {/* Cabecera Fija */}
        <View style={s.headerContainer}>
          <TouchableOpacity
            style={s.backBtnRow}
            onPress={() => router.push('/')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#6B7280" />
            <Text style={s.backBtnText}>Volver a Pacientes</Text>
          </TouchableOpacity>

          <View style={s.patientInfoRow}>
            <View style={s.flex1}>
              <Text style={s.patientName} nativeID="tutorial-patient-name">{patient.name}</Text>
              <Text style={s.patientDiagnosis}>
                {patient.diagnosis} • Post-operatorio, {weeks} semanas
              </Text>
              <Text style={s.patientPeriodText}>Período: {patient.period}</Text>
            </View>
            <View style={s.itemsEnd}>
              <Text style={s.adherenceTitleText}>Adherencia Global</Text>
              <Text style={[s.adherencePercentage, { color: adherenceColor }]}>
                {patient.adherence}%
              </Text>
            </View>
          </View>
        </View>

        <ScrollView style={s.flex1} showsVerticalScrollIndicator={false}>
          <View style={s.notesPaddingWrapper}>
            <View style={s.notesCard}>
              <Text style={s.notesTitle}>Notas médicas:</Text>
              <Text style={s.notesText}>{patient.medicalNotes}</Text>
            </View>

            <View style={s.controlsCard}>
              <View nativeID="tutorial-duration">
                <Text style={s.controlSectionTitle}>Duración</Text>
                <View style={s.counterRow}>
                  <TouchableOpacity style={s.counterBtn} onPress={() => setWeeks(prev => Math.max(1, prev - 1))}>
                    <Text style={s.counterBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={s.counterValueText}>{weeks} Sem.</Text>
                  <TouchableOpacity style={s.counterBtn} onPress={() => setWeeks(prev => prev + 1)}>
                    <Text style={s.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={s.itemsEnd} nativeID="tutorial-status">
                <Text style={s.controlSectionTitle}>Estado</Text>
                <View style={[s.statusBadgeContainer, { borderColor: isActive ? '#00A896' : '#9CA3AF' }]}>
                  <View style={[s.statusDot, { backgroundColor: isActive ? '#00A896' : '#9CA3AF' }]} />
                  <Text style={[s.statusBadgeText, { color: isActive ? '#00A896' : '#9CA3AF' }]}>
                    {patient.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={s.calendarWrapper}>
            <Text style={s.sectionTitle} nativeID="tutorial-planning">
              Planificación de Rutina Semanal
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={s.kanbanScrollContent}>
              {DAYS.map((day) => {
                const dayExercises = routine[day] || [];
                return (
                  <View key={day} style={s.kanbanColumn}>
                    <View style={s.columnHeader}>
                      <Text style={s.columnHeaderTitle}>{day}</Text>
                      <Text style={s.columnHeaderCounter}>({dayExercises.length})</Text>
                    </View>

                    <View nativeID={day === 'Lunes' ? 'tutorial-assign-btn' : undefined}>
                      <TouchableOpacity
                        style={s.assignBtn}
                        onPress={() => router.push({
                          pathname: '/kinesiologo/biblioteca',
                          params: { patientId: patient.id, day },
                        })}
                      >
                        <Ionicons name="add" size={16} color="#00A896" />
                        <Text style={s.assignBtnText}>Asignar</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={s.flex1}>
                      {dayExercises.length === 0 ? (
                        <View style={s.emptyColumnContent}>
                          <Ionicons name="calendar-outline" size={24} color="#D1D5DB" />
                          <Text style={s.emptyColumnText}>Sin ejercicios</Text>
                        </View>
                      ) : (
                        dayExercises.map((exercise) => (
                          <CompactRoutineCard
                            key={exercise.id}
                            exercise={exercise}
                            cardId={exercise.name === 'Puente de Glúteo' ? 'tutorial-exercise-card' : undefined}
                            statusId={exercise.name === 'Puente de Glúteo' ? 'tutorial-exercise-status' : undefined}
                            onEdit={() => handleOpenEdit(day, exercise)}
                            onDelete={() => handleDeleteExercise(day, exercise.id)}
                          />
                        ))
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Modal para editar ejercicio */}
        <Modal
          visible={isEditModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsEditModalOpen(false)}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalContent}>
              <View style={s.modalHeader}>
                <View>
                  <Text style={s.modalTitle}>Editar Ejercicio</Text>
                  <Text style={s.modalSub}>{editName}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsEditModalOpen(false)} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={s.modalBody}>
                <View style={s.row}>
                  <View style={[s.inputGroup, { flex: 1 }]}>
                    <Text style={s.label}>SERIES</Text>
                    <TextInput
                      style={s.input}
                      keyboardType="numeric"
                      value={editSets}
                      onChangeText={setEditSets}
                    />
                  </View>
                  <View style={[s.inputGroup, { flex: 1 }]}>
                    <Text style={s.label}>REPETICIONES</Text>
                    <TextInput
                      style={s.input}
                      keyboardType="numeric"
                      value={editReps}
                      onChangeText={setEditReps}
                    />
                  </View>
                </View>

                <View style={s.row}>
                  <View style={[s.inputGroup, { flex: 1 }]}>
                    <Text style={s.label}>ÁNGULO MÍNIMO (°)</Text>
                    <TextInput
                      style={s.input}
                      keyboardType="numeric"
                      value={editMinAngle}
                      onChangeText={setEditMinAngle}
                      placeholder="Ej: 60"
                    />
                  </View>
                  <View style={[s.inputGroup, { flex: 1 }]}>
                    <Text style={s.label}>ÁNGULO MÁXIMO (°)</Text>
                    <TextInput
                      style={s.input}
                      keyboardType="numeric"
                      value={editMaxAngle}
                      onChangeText={setEditMaxAngle}
                      placeholder="Ej: 90"
                    />
                  </View>
                </View>
              </View>

              <View style={s.modalFooter}>
                <TouchableOpacity
                  style={s.cancelBtn}
                  activeOpacity={0.7}
                  onPress={() => setIsEditModalOpen(false)}
                >
                  <Text style={s.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.saveBtn}
                  activeOpacity={0.7}
                  onPress={handleSaveEdit}
                >
                  <Text style={s.saveBtnText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  webRoot: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any, backgroundColor: '#F1F5F9' } as ViewStyle,
  root: { flex: 1, backgroundColor: '#F1F5F9' } as ViewStyle,
  flex1: { flex: 1 } as ViewStyle,
  centerView: { flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' } as ViewStyle,
  itemsEnd: { alignItems: 'flex-end' } as ViewStyle,
  actionsRow: { flexDirection: 'row', gap: 8 } as ViewStyle,
  emptyViewText: { color: '#9CA3AF', fontSize: 14 } as TextStyle,
  headerContainer: { backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' } as ViewStyle,
  backBtnRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 } as ViewStyle,
  backBtnText: { color: '#6B7280', fontSize: 14, marginLeft: 8, fontWeight: '500' } as TextStyle,
  patientInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' } as ViewStyle,
  patientName: { color: '#002B49', fontSize: 26, fontWeight: '800' } as TextStyle,
  patientDiagnosis: { color: '#00A896', fontSize: 14, fontWeight: '600', marginTop: 2 } as TextStyle,
  patientPeriodText: { color: '#9CA3AF', fontSize: 12, marginTop: 4 } as TextStyle,
  adherenceTitleText: { color: '#9CA3AF', fontSize: 12 } as TextStyle,
  adherencePercentage: { fontSize: 28, fontWeight: '800', marginTop: 2 } as TextStyle,
  notesPaddingWrapper: { paddingHorizontal: 24, marginTop: 16, marginBottom: 16 } as ViewStyle,
  notesCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 } as ViewStyle,
  notesTitle: { color: '#9CA3AF', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 } as TextStyle,
  notesText: { color: '#6B7280', fontSize: 13, lineHeight: 18 } as TextStyle,
  controlsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB' } as ViewStyle,
  controlSectionTitle: { color: '#9CA3AF', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 } as TextStyle,
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 } as ViewStyle,
  counterBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' } as ViewStyle,
  counterBtnText: { color: '#4B5563', fontSize: 16, fontWeight: '700' } as TextStyle,
  counterValueText: { color: '#002B49', fontWeight: '700', fontSize: 15 } as TextStyle,
  statusBadgeContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1.5 } as ViewStyle,
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 } as ViewStyle,
  statusBadgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' } as TextStyle,
  calendarWrapper: { paddingHorizontal: 24, marginBottom: 32 } as ViewStyle,
  sectionTitle: { color: '#002B49', fontSize: 18, fontWeight: '700', marginBottom: 12 } as TextStyle,
  kanbanScrollContent: { gap: 12, paddingBottom: 16, flexDirection: 'row' } as ViewStyle,
  kanbanColumn: { width: 220, backgroundColor: '#E5E7EB', borderRadius: 16, padding: 10, minHeight: 380, flexDirection: 'column' } as ViewStyle,
  columnHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 4 } as ViewStyle,
  columnHeaderTitle: { color: '#002B49', fontSize: 14, fontWeight: '700' } as TextStyle,
  columnHeaderCounter: { color: '#6B7280', fontSize: 12, fontWeight: '600' } as TextStyle,
  assignBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, height: 36, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1.5, borderColor: '#00A896', marginBottom: 10 } as ViewStyle,
  assignBtnText: { color: '#00A896', fontSize: 12, fontWeight: '600' } as TextStyle,
  routineCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' } as ViewStyle,
  cardTopHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 } as ViewStyle,
  cardExerciseName: { color: '#002B49', fontSize: 13, fontWeight: '700', flex: 1, marginRight: 8 } as TextStyle,
  cardExerciseDetails: { color: '#6B7280', fontSize: 12, marginTop: 1 } as TextStyle,
  cardAngle: { color: '#00A896', fontSize: 12, fontWeight: '500', marginTop: 2 } as TextStyle,
  cardBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 } as ViewStyle,
  muscleTag: { backgroundColor: 'rgba(0,168,150,0.08)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 } as ViewStyle,
  muscleTagText: { color: '#00A896', fontSize: 10, fontWeight: '600' } as TextStyle,
  emptyColumnContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 6 } as ViewStyle,
  emptyColumnText: { color: '#9CA3AF', fontSize: 12, fontWeight: '500' } as TextStyle,

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 43, 73, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 20, width: '100%', maxWidth: 480, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 24, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F3F4F6' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#002B49' },
  modalSub: { fontSize: 14, color: '#00A896', fontWeight: '600', marginTop: 4 },
  modalBody: { padding: 24, gap: 16 },
  row: { flexDirection: 'row', gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 12, fontWeight: '700', color: '#6B7280', letterSpacing: 0.5 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14, color: '#002B49', outlineStyle: 'none' as any },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, padding: 24, paddingTop: 0 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  cancelBtnText: { color: '#6B7280', fontWeight: '600', fontSize: 14 },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10, backgroundColor: '#00A896' },
  saveBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});
