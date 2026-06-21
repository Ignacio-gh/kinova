import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { useBiblioteca, CATEGORY_FILTERS } from '@/hooks/use-biblioteca';
import { SkeletonBox } from '@/components/ui/skeleton';
import { useMisPacientes } from '@/hooks/use-mis-pacientes';
import { api } from '@/services/api';
import type { Exercise } from '@/components/kinesiologo/exercise-card';
import React from 'react';
import { useTutorial } from '@/context/TutorialContext';
import MockBiblioteca from '@/mock/mock-biblioteca.web';
import { useIsMobileBrowser } from '@/hooks/use-mobile-browser';
import MobileBiblioteca from './biblioteca.tsx';

const C = {
  bg: '#F1F5F9',
  white: '#FFFFFF',
  navy: '#002B49',
  turquoise: '#00A896',
  turquoiseDim: 'rgba(0,168,150,0.10)',
  turquoiseBg: '#e5f7f5',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  border: '#E5E7EB',
};

const CATEGORY_COLORS: Record<string, string> = {
  Muslo: '#EFF6FF',
  Rodilla: '#FFF7ED',
  Cadera: '#FDF4FF',
  Tobillo: '#F0FDF4',
  Glúteo: '#FFF1F2',
};
const CATEGORY_TEXT: Record<string, string> = {
  Muslo: '#3B82F6',
  Rodilla: '#F97316',
  Cadera: '#A855F7',
  Tobillo: '#22C55E',
  Glúteo: '#EF4444',
};

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAY_TO_ENGLISH: Record<string, string> = {
  Lunes: 'monday', Martes: 'tuesday', Miércoles: 'wednesday',
  Jueves: 'thursday', Viernes: 'friday', Sábado: 'saturday', Domingo: 'sunday',
};

export default function BibliotecaWeb() {
  const isMobile = useIsMobileBrowser();
  const { isTutorialActive } = useTutorial();
  const { search, setSearch, filter, setFilter, filtered, loading } = useBiblioteca();
  const { filtered: allPatients, loading: patientsLoading } = useMisPacientes();
  const activePatients = allPatients.filter((p) => p.status === 'Activo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [assignError, setAssignError] = useState('');
  const [assignSaving, setAssignSaving] = useState(false);

  if (isMobile) return <MobileBiblioteca />;
  if (isTutorialActive) return <MockBiblioteca />;

  // --- Estados del Formulario ---
  const [patientId, setPatientId] = useState('');
  const [day, setDay] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('15');
  const [minAngle, setMinAngle] = useState('');
  const [maxAngle, setMaxAngle] = useState('');

  // --- Estados de los Dropdowns Personalizados ---
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);

  const handleOpenAssign = (ex: Exercise) => {
    setSelectedExercise(ex);
    // Reiniciar valores por defecto
    setPatientId('');
    setDay('');
    setSets('3');
    setReps('15');
    setMinAngle('');
    setMaxAngle('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
    setIsPatientDropdownOpen(false);
    setIsDayDropdownOpen(false);
  };

  const handleSave = async () => {
    setAssignError('');
    if (!patientId || !day) {
      setAssignError('Seleccioná un paciente y un día.');
      return;
    }
    setAssignSaving(true);
    try {
      await api.post('/api/v1/routines/', {
        patient_id: Number(patientId),
        exercise_id: Number(selectedExercise!.id),
        day_of_week: DAY_TO_ENGLISH[day],
        sets: Number(sets) || 3,
        reps: Number(reps) || 15,
        angle_min: minAngle ? Number(minAngle) : null,
        angle_max: maxAngle ? Number(maxAngle) : null,
      });
      handleCloseModal();
    } catch (e: any) {
      setAssignError(e.message ?? 'Error al asignar ejercicio.');
    } finally {
      setAssignSaving(false);
    }
  };

  return (
    <View style={s.root}>
      <WebSidebarKine />

      <View style={s.main}>
        {/* Topbar */}
        <View style={s.topbar}>
          <View>
            <Text style={s.pageTitle}>Biblioteca de Ejercicios</Text>
            <Text style={s.pageSub}>Catálogo de ejercicios de tren inferior para rehabilitación</Text>
          </View>
        </View>

        {/* Toolbar */}
        <View style={s.toolbar}>
          <View style={s.searchWrap}>
            <Ionicons name="search-outline" size={18} color={C.gray400} style={{ marginRight: 8 }} />
            <TextInput
              style={s.searchInput}
              placeholder="Buscar por nombre o músculo objetivo..."
              placeholderTextColor={C.gray400}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={C.gray400} />
              </TouchableOpacity>
            )}
          </View>
          <View style={s.filters}>
            {CATEGORY_FILTERS.map((f) => {
              const active = filter === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[s.filterBtn, active && s.filterBtnActive]}
                  onPress={() => setFilter(f)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.filterText, active && s.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Grid de ejercicios */}
        <ScrollView
          style={s.grid}
          contentContainerStyle={s.gridContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={s.cardGrid}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={s.exCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <SkeletonBox width={70} height={22} radius={20} delay={i * 40} />
                    <SkeletonBox width={80} height={28} radius={8} delay={i * 40 + 60} />
                  </View>
                  <SkeletonBox width="75%" height={20} radius={6} delay={i * 40 + 80} />
                  <View style={{ gap: 6, marginTop: 10 }}>
                    <SkeletonBox width="100%" height={13} radius={5} delay={i * 40 + 120} />
                    <SkeletonBox width="85%" height={13} radius={5} delay={i * 40 + 160} />
                    <SkeletonBox width="65%" height={13} radius={5} delay={i * 40 + 200} />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 14 }}>
                    <SkeletonBox width={64} height={22} radius={20} delay={i * 40 + 100} />
                    <SkeletonBox width={80} height={22} radius={20} delay={i * 40 + 120} />
                  </View>
                  <View style={{ gap: 8, marginTop: 14, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 14 }}>
                    <SkeletonBox width="65%" height={12} radius={5} delay={i * 40 + 140} />
                    <SkeletonBox width="50%" height={12} radius={5} delay={i * 40 + 180} />
                  </View>
                </View>
              ))}
            </View>
          ) : filtered.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="barbell-outline" size={48} color={C.gray200} />
              <Text style={s.emptyText}>No se encontraron ejercicios</Text>
            </View>
          ) : (
            <View style={s.cardGrid}>
              {filtered.map((ex) => {
                const catBg = CATEGORY_COLORS[ex.category] ?? C.turquoiseBg;
                const catText = CATEGORY_TEXT[ex.category] ?? C.turquoise;
                return (
                  <View key={ex.id} style={s.exCard}>
                    {/* Header */}
                    <View style={s.exCardHead}>
                      <View style={[s.catBadge, { backgroundColor: catBg }]}>
                        <Text style={[s.catText, { color: catText }]}>{ex.category}</Text>
                      </View>
                      <TouchableOpacity 
                        style={s.assignBtn} 
                        activeOpacity={0.8}
                        onPress={() => handleOpenAssign(ex as any)}
                      >
                        <Ionicons name="add" size={14} color={C.white} />
                        <Text style={s.assignBtnText}>Asignar</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Nombre */}
                    <Text style={s.exName}>{ex.name}</Text>

                    {/* Descripción */}
                    <Text style={s.exDesc} numberOfLines={3}>{ex.description}</Text>

                    {/* Músculos */}
                    <View style={s.muscleList}>
                      {ex.muscles.map((m) => (
                        <View key={m} style={s.muscleTag}>
                          <Text style={s.muscleText}>{m}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Beneficios */}
                    <View style={s.benefits}>
                      {ex.benefits.map((b) => (
                        <View key={b} style={s.benefitRow}>
                          <Ionicons name="checkmark-circle" size={14} color={C.turquoise} />
                          <Text style={s.benefitText}>{b}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>

      {/* --- Modal de Asignación --- */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            {/* Modal Header */}
            <View style={s.modalHeader}>
              <View>
                <Text style={s.modalTitle}>Asignar Ejercicio</Text>
                <Text style={s.modalSub}>{selectedExercise?.name}</Text>
              </View>
              <TouchableOpacity onPress={handleCloseModal} hitSlop={10}>
                <Ionicons name="close" size={24} color={C.gray500} />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <View style={s.modalBody}>
              {/* Paciente */}

<View style={[s.inputGroup, { zIndex: 2 }]}> {/* <-- zIndex movido al contenedor principal */}
  <Text style={s.label}>PACIENTE (ACTIVOS)</Text>
  <View> {/* <-- Se eliminó el zIndex de aquí */}
    <TouchableOpacity 
      style={s.dropdownBtn} 
      activeOpacity={0.8}
      onPress={() => {
        setIsPatientDropdownOpen(!isPatientDropdownOpen);
        setIsDayDropdownOpen(false);
      }}
    >
      <Text style={[s.dropdownText, !patientId && { color: C.gray400 }]}>
        {patientsLoading
          ? 'Cargando pacientes...'
          : patientId
            ? activePatients.find(p => p.id === patientId)?.name
            : activePatients.length === 0
              ? 'Sin pacientes activos'
              : 'Seleccionar paciente...'}
      </Text>
      <Ionicons name={isPatientDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color={C.gray500} />
    </TouchableOpacity>
    {isPatientDropdownOpen && !patientsLoading && (
      <View style={s.dropdownList}>
        <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
          {activePatients.length === 0 ? (
            <Text style={[s.dropdownText, { padding: 12, color: C.gray400 }]}>No hay pacientes activos</Text>
          ) : activePatients.map(p => (
            <TouchableOpacity 
              key={p.id} 
              style={s.dropdownItem} 
              onPress={() => {
                setPatientId(p.id);
                setIsPatientDropdownOpen(false);
              }}
            >
              <Text style={s.dropdownItemText}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}
  </View>
</View>

              {/* Día */}
              <View style={[s.inputGroup, { zIndex: 1 }]}>
                <Text style={s.label}>DÍA DE LA SEMANA</Text>
                <View>
                  <TouchableOpacity 
                    style={s.dropdownBtn} 
                    activeOpacity={0.8}
                    onPress={() => {
                      setIsDayDropdownOpen(!isDayDropdownOpen);
                      setIsPatientDropdownOpen(false);
                    }}
                  >
                    <Text style={[s.dropdownText, !day && { color: C.gray400 }]}>
                      {day || 'Seleccionar día...'}
                    </Text>
                    <Ionicons name={isDayDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color={C.gray500} />
                  </TouchableOpacity>
                  {isDayDropdownOpen && (
                    <View style={s.dropdownList}>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                        {DAYS.map(d => (
                          <TouchableOpacity 
                            key={d} 
                            style={s.dropdownItem} 
                            onPress={() => {
                              setDay(d);
                              setIsDayDropdownOpen(false);
                            }}
                          >
                            <Text style={s.dropdownItemText}>{d}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              {/* Series y Repeticiones */}
              <View style={s.row}>
                <View style={[s.inputGroup, { flex: 1 }]}>
                  <Text style={s.label}>SERIES</Text>
                  <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    value={sets}
                    onChangeText={setSets}
                    placeholder="Ej: 3"
                  />
                </View>
                <View style={[s.inputGroup, { flex: 1 }]}>
                  <Text style={s.label}>REPETICIONES</Text>
                  <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={setReps}
                    placeholder="Ej: 15"
                  />
                </View>
              </View>

              {/* Rango Angular */}
              <View style={s.row}>
                <View style={[s.inputGroup, { flex: 1 }]}>
                  <Text style={s.label}>ÁNGULO MÍNIMO (°)</Text>
                  <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    value={minAngle}
                    onChangeText={setMinAngle}
                    placeholder="Vacío o '-'"
                  />
                </View>
                <View style={[s.inputGroup, { flex: 1 }]}>
                  <Text style={s.label}>ÁNGULO MÁXIMO (°)</Text>
                  <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    value={maxAngle}
                    onChangeText={setMaxAngle}
                    placeholder="Vacío o '-'"
                  />
                </View>
              </View>
            </View>

            {/* Modal Footer */}
            {!!assignError && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 8, padding: 10, marginBottom: 12 }}>
                <Ionicons name="alert-circle-outline" size={15} color="#DC2626" />
                <Text style={{ color: '#DC2626', fontSize: 12, flex: 1 }}>{assignError}</Text>
              </View>
            )}
            <View style={s.modalFooter}>
              <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7} onPress={handleCloseModal}>
                <Text style={s.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.saveBtn, assignSaving && { opacity: 0.6 }]} activeOpacity={0.7} onPress={handleSave} disabled={assignSaving}>
                <Text style={s.saveBtnText}>{assignSaving ? 'Guardando...' : 'Asignar ejercicio'}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any, backgroundColor: C.bg },
  main: { flex: 1, flexDirection: 'column', overflow: 'hidden' },
  topbar: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 36, paddingTop: 32, paddingBottom: 20,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  pageTitle: { color: C.navy, fontSize: 26, fontWeight: '800' },
  pageSub: { color: C.gray400, fontSize: 13, marginTop: 3 },
  toolbar: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingHorizontal: 36, paddingVertical: 16,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bg, borderRadius: 10,
    paddingHorizontal: 14, height: 40,
    borderWidth: 1, borderColor: C.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.navy, outlineStyle: 'none' as any },
  filters: { flexDirection: 'row', gap: 6 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.turquoise, borderColor: C.turquoise },
  filterText: { fontSize: 13, fontWeight: '500', color: C.gray500 },
  filterTextActive: { color: C.white },
  grid: { flex: 1 },
  gridContent: { padding: 36 },
  cardGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 20,
  },
  exCard: {
    backgroundColor: C.white, borderRadius: 16, padding: 24,
    minWidth: 280, flex: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8,
    borderWidth: 1, borderColor: C.border,
  },
  exCardHead: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  catText: { fontSize: 12, fontWeight: '700' },
  assignBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.turquoise, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  assignBtnText: { color: C.white, fontSize: 12, fontWeight: '600' },
  exName: { color: C.navy, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  exDesc: { color: C.gray500, fontSize: 13, lineHeight: 20, marginBottom: 14 },
  muscleList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  muscleTag: {
    backgroundColor: C.gray100, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  muscleText: { color: C.gray500, fontSize: 11, fontWeight: '500' },
  benefits: { gap: 6, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 14 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  benefitText: { color: C.gray500, fontSize: 13, flex: 1 },
  empty: { alignItems: 'center', paddingVertical: 80, gap: 12 },
  emptyText: { color: C.gray400, fontSize: 15 },

  /* Estilos del Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 43, 73, 0.4)', // Fondo oscuro usando el C.navy con opacidad
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: C.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.gray100,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: C.navy },
  modalSub: { fontSize: 14, color: C.turquoise, fontWeight: '600', marginTop: 4 },
  modalBody: { padding: 24, gap: 16 },
  row: { flexDirection: 'row', gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 12, fontWeight: '700', color: C.gray500, letterSpacing: 0.5 },
  input: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: C.navy,
    outlineStyle: 'none' as any,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
  },
  dropdownText: { fontSize: 14, color: C.navy },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.gray100 },
  dropdownItemText: { fontSize: 14, color: C.navy },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 24,
    paddingTop: 0,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  cancelBtnText: { color: C.gray500, fontWeight: '600', fontSize: 14 },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: C.turquoise,
  },
  saveBtnText: { color: C.white, fontWeight: '600', fontSize: 14 },
});
