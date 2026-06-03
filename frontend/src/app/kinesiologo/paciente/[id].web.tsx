import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { api } from '@/services/api';
import React from 'react';
import { useTutorial } from '@/context/TutorialContext';
import MockPatientDetail from '@/mock/mock-[id]';

const C = {
  bg: '#F1F5F9', white: '#FFFFFF', navy: '#002B49',
  turquoise: '#00A896', turquoiseDim: 'rgba(0,168,150,0.10)',
  gray100: '#F3F4F6', gray200: '#E5E7EB', gray400: '#9CA3AF',
  gray500: '#6B7280', border: '#E5E7EB',
  green: '#16A34A', amber: '#F59E0B', red: '#EF4444',
};

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;
type Day = (typeof DAYS)[number];

const DAY_MAP: Record<string, Day> = {
  monday: 'Lun', tuesday: 'Mar', wednesday: 'Mié',
  thursday: 'Jue', friday: 'Vie', saturday: 'Sáb', sunday: 'Dom',
};

function buildAngle(min: number | null, max: number | null) {
  return min != null && max != null ? `${min}° - ${max}°` : null;
}

export default function PatientDetailWeb() {
  const { isTutorialActive } = useTutorial();

  if (isTutorialActive) {
    return <MockPatientDetail />;
  }
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedDay, setSelectedDay] = useState<Day>('Lun');
  const [patient, setPatient] = useState<any>(null);
  const [routine, setRoutine] = useState<Record<Day, any[]>>(
    Object.fromEntries(DAYS.map((d) => [d, []])) as any
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Edit modal
  const [editRoutine, setEditRoutine] = useState<any>(null);
  const [editMinAngle, setEditMinAngle] = useState('');
  const [editMaxAngle, setEditMaxAngle] = useState('');
  const [editReps, setEditReps] = useState('');
  const [editSets, setEditSets] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<any>(`/api/v1/patients/${id}`),
      api.get<any>(`/api/v1/routines/patient/${id}`),
    ])
      .then(([p, w]) => {
        setPatient(p);
        const mapped: any = Object.fromEntries(DAYS.map((d) => [d, []]));
        for (const [day, items] of Object.entries(w) as [string, any[]][]) {
          const d = DAY_MAP[day];
          if (d) mapped[d] = items;
        }
        setRoutine(mapped);
      })
      .catch((e) => setError(e.message ?? 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [id]);

  const openEdit = (r: any) => {
    setEditRoutine(r);
    setEditMinAngle(r.angle_min != null ? String(r.angle_min) : '');
    setEditMaxAngle(r.angle_max != null ? String(r.angle_max) : '');
    setEditReps(String(r.reps));
    setEditSets(String(r.sets));
    setEditError('');
  };

  const handleSaveEdit = async () => {
    if (!editRoutine) return;
    setEditSaving(true);
    setEditError('');
    try {
      await api.put(`/api/v1/routines/${editRoutine.id}`, {
        reps: Number(editReps) || editRoutine.reps,
        sets: Number(editSets) || editRoutine.sets,
        angle_min: editMinAngle !== '' ? Number(editMinAngle) : null,
        angle_max: editMaxAngle !== '' ? Number(editMaxAngle) : null,
      });
      // Refresh routine
      const w = await api.get<any>(`/api/v1/routines/patient/${id}`);
      const mapped: any = Object.fromEntries(DAYS.map((d) => [d, []]));
      for (const [day, items] of Object.entries(w) as [string, any[]][]) {
        const d = DAY_MAP[day];
        if (d) mapped[d] = items;
      }
      setRoutine(mapped);
      setEditRoutine(null);
    } catch (e: any) {
      setEditError(e.message ?? 'Error al guardar');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (routineId: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('¿Eliminar este ejercicio de la rutina?')) return;
    try {
      await api.delete(`/api/v1/routines/${routineId}`);
      const w = await api.get<any>(`/api/v1/routines/patient/${id}`);
      const mapped: any = Object.fromEntries(DAYS.map((d) => [d, []]));
      for (const [day, items] of Object.entries(w) as [string, any[]][]) {
        const d = DAY_MAP[day];
        if (d) mapped[d] = items;
      }
      setRoutine(mapped);
    } catch (e: any) {
      alert(e.message ?? 'Error al eliminar');
    }
  };

  if (loading) {
    return (
      <View style={s.root}>
        <WebSidebarKine />
        <View style={s.center}><ActivityIndicator size="large" color={C.turquoise} /></View>
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={s.root}>
        <WebSidebarKine />
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={40} color={C.gray400} />
          <Text style={{ color: C.gray400, marginTop: 12 }}>{error || 'Paciente no encontrado'}</Text>
        </View>
      </View>
    );
  }

  const adherence = Math.round(patient.adherence_pct ?? 0);
  const adherenceColor = adherence >= 90 ? C.green : adherence >= 70 ? C.amber : C.red;
  const isActive = patient.status === 'activo';

  const startDate = patient.treatment_start_date
    ? new Date(patient.treatment_start_date).toLocaleDateString('es-AR') : '-';
  const endDate = patient.treatment_start_date && patient.treatment_weeks
    ? new Date(new Date(patient.treatment_start_date).getTime() + patient.treatment_weeks * 7 * 86400000).toLocaleDateString('es-AR')
    : '-';

  const dayExercises = routine[selectedDay] ?? [];

  return (
    <View style={s.root}>
      <WebSidebarKine />
      <View style={s.main}>
        {/* Topbar */}
        <View style={s.topbar}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={18} color={C.gray500} />
            <Text style={s.backText}>Mis Pacientes</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 36, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          {/* ── Header del paciente ── */}
          <View style={s.headerCard}>
            <View style={s.avatarLg}>
              <Text style={s.avatarLgText}>
                {patient.user.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.nameRow}>
                <Text style={s.patientName}>{patient.user.full_name}</Text>
                <View style={[s.statusBadge, { borderColor: isActive ? C.turquoise : C.gray400 }]}>
                  <View style={[s.statusDot, { backgroundColor: isActive ? C.turquoise : C.gray400 }]} />
                  <Text style={[s.statusText, { color: isActive ? C.turquoise : C.gray400 }]}>
                    {isActive ? 'Activo' : 'Finalizado'}
                  </Text>
                </View>
              </View>
              <Text style={s.diagText}>{patient.diagnosis}</Text>
              <Text style={s.emailText}>{patient.user.email}</Text>
            </View>
            <View style={s.adherenceBox}>
              <Text style={s.adherenceLabel}>Adherencia</Text>
              <Text style={[s.adherenceVal, { color: adherenceColor }]}>{adherence}%</Text>
              <Text style={s.weekText}>Semana {patient.current_week}/{patient.treatment_weeks}</Text>
            </View>
          </View>

          {/* ── Info cards ── */}
          <View style={s.infoGrid}>
            <View style={s.infoCard}>
              <Text style={s.infoLabel}>Inicio</Text>
              <Text style={s.infoVal}>{startDate}</Text>
            </View>
            <View style={s.infoCard}>
              <Text style={s.infoLabel}>Fin estimado</Text>
              <Text style={s.infoVal}>{endDate}</Text>
            </View>
            <View style={s.infoCard}>
              <Text style={s.infoLabel}>Duración</Text>
              <Text style={s.infoVal}>{patient.treatment_weeks} semanas</Text>
            </View>
            <View style={s.infoCard}>
              <Text style={s.infoLabel}>Teléfono</Text>
              <Text style={s.infoVal}>{patient.phone ?? 'No registrado'}</Text>
            </View>
          </View>

          {patient.notes ? (
            <View style={s.notesCard}>
              <Text style={s.notesLabel}>Notas clínicas</Text>
              <Text style={s.notesText}>{patient.notes}</Text>
            </View>
          ) : null}

          {/* ── Rutina semanal ── */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Rutina Semanal</Text>
          </View>

          {/* Selector de días */}
          <View style={s.daySelector}>
            {DAYS.map((day) => {
              const active = selectedDay === day;
              const count = (routine[day] ?? []).length;
              return (
                <TouchableOpacity
                  key={day}
                  style={[s.dayBtn, active && s.dayBtnActive]}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.dayBtnText, active && s.dayBtnTextActive]}>{day}</Text>
                  {count > 0 && (
                    <View style={[s.dayCount, { backgroundColor: active ? 'rgba(255,255,255,0.3)' : C.turquoiseDim }]}>
                      <Text style={[s.dayCountText, { color: active ? C.white : C.turquoise }]}>{count}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Ejercicios del día */}
          {dayExercises.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="calendar-outline" size={36} color={C.gray200} />
              <Text style={s.emptyText}>Sin ejercicios para {selectedDay}</Text>
            </View>
          ) : (
            <View style={s.exGrid}>
              {dayExercises.map((r: any) => {
                const angle = buildAngle(r.angle_min, r.angle_max);
                return (
                  <View key={r.id} style={s.exCard}>
                    <View style={s.exCardHead}>
                      <Text style={s.exName}>{r.exercise.name}</Text>
                      <View style={s.zoneBadge}>
                        <Text style={s.zoneText}>{r.exercise.zone}</Text>
                      </View>
                    </View>
                    <Text style={s.exDetail}>{r.sets} series × {r.reps} reps</Text>
                    {angle && <Text style={[s.exDetail, { color: C.turquoise }]}>Ángulo: {angle}</Text>}
                    <View style={s.exActions}>
                      <TouchableOpacity style={s.editBtn} onPress={() => openEdit(r)} activeOpacity={0.7}>
                        <Ionicons name="pencil-outline" size={14} color={C.turquoise} />
                        <Text style={s.editBtnText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(r.id)} activeOpacity={0.7}>
                        <Ionicons name="trash-outline" size={14} color={C.red} />
                        <Text style={s.deleteBtnText}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Modal editar ejercicio */}
          <Modal visible={!!editRoutine} transparent animationType="fade" onRequestClose={() => setEditRoutine(null)}>
            <View style={s.overlay}>
              <View style={s.editModal}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={s.editModalTitle}>Editar ejercicio</Text>
                  <TouchableOpacity onPress={() => setEditRoutine(null)}>
                    <Ionicons name="close" size={22} color={C.gray400} />
                  </TouchableOpacity>
                </View>
                {editRoutine && (
                  <Text style={{ color: C.turquoise, fontWeight: '700', marginBottom: 16 }}>{editRoutine.exercise?.name}</Text>
                )}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.editLabel}>Series</Text>
                    <TextInput style={s.editInput} value={editSets} onChangeText={setEditSets} keyboardType="numeric" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.editLabel}>Repeticiones</Text>
                    <TextInput style={s.editInput} value={editReps} onChangeText={setEditReps} keyboardType="numeric" />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.editLabel}>Ángulo mínimo (°)</Text>
                    <TextInput style={s.editInput} value={editMinAngle} onChangeText={setEditMinAngle} keyboardType="numeric" placeholder="ej: 60" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.editLabel}>Ángulo máximo (°)</Text>
                    <TextInput style={s.editInput} value={editMaxAngle} onChangeText={setEditMaxAngle} keyboardType="numeric" placeholder="ej: 90" />
                  </View>
                </View>
                {!!editError && (
                  <Text style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>{editError}</Text>
                )}
                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
                  <TouchableOpacity style={s.cancelBtn} onPress={() => setEditRoutine(null)}>
                    <Text style={s.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.saveBtn, editSaving && { opacity: 0.6 }]} onPress={handleSaveEdit} disabled={editSaving}>
                    <Text style={s.saveBtnText}>{editSaving ? 'Guardando...' : 'Guardar cambios'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any, backgroundColor: C.bg },
  main: { flex: 1, flexDirection: 'column', overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topbar: {
    paddingHorizontal: 36, paddingVertical: 20,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  backText: { color: C.gray500, fontSize: 14, fontWeight: '500' },

  headerCard: {
    backgroundColor: C.white, borderRadius: 20, padding: 28,
    flexDirection: 'row', alignItems: 'center', gap: 20,
    borderWidth: 1, borderColor: C.border, marginBottom: 16,
  },
  avatarLg: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: C.turquoiseDim, alignItems: 'center', justifyContent: 'center',
  },
  avatarLgText: { color: C.turquoise, fontWeight: '800', fontSize: 24 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  patientName: { color: C.navy, fontSize: 22, fontWeight: '800' },
  diagText: { color: C.gray500, fontSize: 14, marginBottom: 2 },
  emailText: { color: C.gray400, fontSize: 13 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  adherenceBox: { alignItems: 'flex-end' },
  adherenceLabel: { color: C.gray400, fontSize: 11, fontWeight: '600' },
  adherenceVal: { fontSize: 36, fontWeight: '800' },
  weekText: { color: C.gray400, fontSize: 12 },

  infoGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoCard: {
    flex: 1, backgroundColor: C.white, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: C.border,
  },
  infoLabel: { color: C.gray400, fontSize: 11, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  infoVal: { color: C.navy, fontSize: 15, fontWeight: '700' },

  notesCard: {
    backgroundColor: C.white, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 24,
  },
  notesLabel: { color: C.gray400, fontSize: 11, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  notesText: { color: C.gray500, fontSize: 14, lineHeight: 22 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: C.navy, fontSize: 18, fontWeight: '800' },

  daySelector: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  dayBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border,
  },
  dayBtnActive: { backgroundColor: C.turquoise, borderColor: C.turquoise },
  dayBtnText: { color: C.navy, fontSize: 13, fontWeight: '600' },
  dayBtnTextActive: { color: C.white },
  dayCount: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  dayCountText: { fontSize: 11, fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyText: { color: C.gray400, fontSize: 14 },

  exGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  exCard: {
    backgroundColor: C.white, borderRadius: 14, padding: 18,
    borderWidth: 1, borderColor: C.border, minWidth: 260, flex: 1,
  },
  exCardHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 8 },
  exName: { color: C.navy, fontSize: 15, fontWeight: '700', flex: 1 },
  zoneBadge: { backgroundColor: C.turquoiseDim, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  zoneText: { color: C.turquoise, fontSize: 11, fontWeight: '600' },
  exDetail: { color: C.gray500, fontSize: 13, marginTop: 2 },
  exActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1.5, borderColor: C.turquoise, borderRadius: 8, paddingVertical: 8 },
  editBtnText: { color: C.turquoise, fontSize: 12, fontWeight: '600' },
  deleteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1.5, borderColor: C.red, borderRadius: 8, paddingVertical: 8 },
  deleteBtnText: { color: C.red, fontSize: 12, fontWeight: '600' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  editModal: { backgroundColor: C.white, borderRadius: 20, padding: 28, width: 480, maxWidth: '95%' as any },
  editModalTitle: { color: C.navy, fontSize: 18, fontWeight: '800' },
  editLabel: { color: C.navy, fontSize: 12, fontWeight: '600', marginBottom: 5 },
  editInput: { borderWidth: 1.5, borderColor: C.border, borderRadius: 10, height: 42, paddingHorizontal: 12, fontSize: 14, color: C.navy, backgroundColor: C.white, outlineStyle: 'none' as any },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: C.border },
  cancelBtnText: { color: C.gray500, fontSize: 14, fontWeight: '600' },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10, backgroundColor: C.turquoise },
  saveBtnText: { color: C.white, fontSize: 14, fontWeight: '700' },
});
