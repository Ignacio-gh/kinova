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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { useBiblioteca, CATEGORY_FILTERS } from '@/hooks/use-biblioteca';
import { MOCK_PATIENTS } from '@/mock/mock-use-mis-pacientes';
import type { Exercise } from '@/components/kinesiologo/exercise-card';
import { KinovaColors } from '@/constants/colors';

const C = {
  ...KinovaColors,
  turquoiseDim: 'rgba(0,168,150,0.10)',
};

const CATEGORY_COLORS: Record<string, string> = { Muslo: '#EFF6FF', Rodilla: '#FFF7ED', Cadera: '#FDF4FF', Tobillo: '#F0FDF4', Glúteo: '#FFF1F2' };
const CATEGORY_TEXT: Record<string, string> = { Muslo: '#3B82F6', Rodilla: '#F97316', Cadera: '#A855F7', Tobillo: '#22C55E', Glúteo: '#EF4444' };

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function BibliotecaWeb() {
  const router = useRouter();
  const { patientId: prefilledPatientId, day: prefilledDay } = useLocalSearchParams<{ patientId?: string, day?: string }>();

  const { search, setSearch, filter, setFilter, filtered } = useBiblioteca();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const [patientId, setPatientId] = useState('');
  const [day, setDay] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('15');
  const [minAngle, setMinAngle] = useState('');
  const [maxAngle, setMaxAngle] = useState('');

  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);

  const activePatients = MOCK_PATIENTS.filter((p) => p.status === 'Activo');

  const handleOpenAssign = (ex: Exercise) => {
    setSelectedExercise(ex);
    setPatientId(prefilledPatientId || '');
    setDay(prefilledDay || '');
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

  const handleSave = () => {
    if (!patientId || !day) {
      alert('Por favor, selecciona un paciente y un día.');
      return;
    }
    
    const exName = selectedExercise?.name;
    const exMuscle = selectedExercise?.muscles[0] || 'General';
    const exAngle = (minAngle && maxAngle) ? `${minAngle}° - ${maxAngle}°` : '-';
    
    handleCloseModal();

    if (prefilledPatientId) {
      router.push({
        pathname: `/kinesiologo/paciente/${prefilledPatientId}` as any,
        params: {
          newExerciseName: exName,
          newExerciseDay: day,
          newExerciseSets: sets,
          newExerciseReps: reps,
          newExerciseMuscle: exMuscle,
          newExerciseAngle: exAngle
        }
      });
    }
  };

  return (
    <View style={s.root}>
      <WebSidebarKine />

      <View style={s.main}>
        {/* Topbar */}
        <View style={s.topbar}>
          {/* PASO 12: Título Biblioteca */}
          <View nativeID="tutorial-biblio-title">
            <Text style={s.pageTitle}>Biblioteca de Ejercicios</Text>
            <Text style={s.pageSub}>Catálogo de ejercicios de tren inferior para rehabilitación</Text>
          </View>
        </View>

        {/* Toolbar */}
        <View style={s.toolbar}>
          {/* PASO 13: Barra de Búsqueda */}
          <View style={s.searchWrap} nativeID="tutorial-biblio-search">
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
            {CATEGORY_FILTERS.map((f, i) => {
              const active = filter === f;
              return (
                // PASO 14: Filtro (Anclado al primer botón que suele ser "Todos")
                <View nativeID={i === 0 ? 'tutorial-biblio-filter' : undefined} key={f}>
                  <TouchableOpacity
                    style={[s.filterBtn, active && s.filterBtnActive]}
                    onPress={() => setFilter(f)}
                    activeOpacity={0.7}
                  >
                    <Text style={[s.filterText, active && s.filterTextActive]}>{f}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Grid de ejercicios */}
        <ScrollView style={s.grid} contentContainerStyle={s.gridContent} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="barbell-outline" size={48} color={C.gray200} />
              <Text style={s.emptyText}>No se encontraron ejercicios</Text>
            </View>
          ) : (
            <View style={s.cardGrid}>
              {filtered.map((ex, i) => {
                const catBg = CATEGORY_COLORS[ex.category] ?? C.turquoiseBg;
                const catText = CATEGORY_TEXT[ex.category] ?? C.turquoise;
                
                // Buscamos si es "Sentadilla" (o le anclamos a la primera tarjeta si por algún filtro no se llama así)
                const isTargetCard = ex.name.includes('Sentadilla') || i === 0;

                return (
                  // PASO 15: Tarjeta Sentadilla
                  <View key={ex.id} style={s.exCard} nativeID={isTargetCard ? 'tutorial-biblio-card' : undefined}>
                    {/* Header */}
                    <View style={s.exCardHead}>
                      <View style={[s.catBadge, { backgroundColor: catBg }]}>
                        <Text style={[s.catText, { color: catText }]}>{ex.category}</Text>
                      </View>
                      
                      {/* PASO 16: Botón Asignar de Sentadilla */}
                      <View nativeID={isTargetCard ? 'tutorial-biblio-assign' : undefined}>
                        <TouchableOpacity 
                          style={s.assignBtn} 
                          activeOpacity={0.8}
                          onPress={() => handleOpenAssign(ex as any)}
                        >
                          <Ionicons name="add" size={14} color={C.white} />
                          <Text style={s.assignBtnText}>Asignar</Text>
                        </TouchableOpacity>
                      </View>
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
              <View style={[s.inputGroup, { zIndex: 2 }]}>
                <Text style={s.label}>PACIENTE (ACTIVOS)</Text>
                <View>
                  <TouchableOpacity 
                    style={s.dropdownBtn} 
                    activeOpacity={0.8}
                    onPress={() => {
                      setIsPatientDropdownOpen(!isPatientDropdownOpen);
                      setIsDayDropdownOpen(false);
                    }}
                  >
                    <Text style={[s.dropdownText, !patientId && { color: C.gray400 }]}>
                      {patientId ? activePatients.find(p => p.id === patientId)?.name : 'Seleccionar paciente...'}
                    </Text>
                    <Ionicons name={isPatientDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color={C.gray500} />
                  </TouchableOpacity>
                  {isPatientDropdownOpen && (
                    <View style={s.dropdownList}>
                      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                        {activePatients.map(p => (
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
            <View style={s.modalFooter}>
              <TouchableOpacity 
                style={s.cancelBtn} 
                activeOpacity={0.7}
                onPress={handleCloseModal}
              >
                <Text style={s.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={s.saveBtn} 
                activeOpacity={0.7}
                onPress={handleSave}
              >
                <Text style={s.saveBtnText}>Guardar</Text>
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
    backgroundColor: 'rgba(0, 43, 73, 0.4)',
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