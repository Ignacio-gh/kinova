import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { useMisPacientes, FILTERS, FILTER_LABELS } from '@/mock/mock-use-mis-pacientes';
import { KinovaColors } from '@/constants/colors';

const C = {
  ...KinovaColors,
  turquoiseDim: 'rgba(0,168,150,0.10)',
};

const adherenceColor = (v: number) =>
  v >= 90 ? C.green : v >= 70 ? C.amber : C.red;

export default function MisPacientesWeb() {
  const { search, setSearch, filter, setFilter, filtered, goToPatient } = useMisPacientes();
  
  // 1. Estado para guardar los pacientes recién creados en memoria
  const [pacientesTemporales, setPacientesTemporales] = useState<any[]>([]);

  // Estado para controlar la apertura del modal y los datos del formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    lesion: '',
    semanas: '',
    notas: ''
  });

  const handleAgregarPaciente = () => {
    // Validación súper básica para que no creen perfiles vacíos
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.lesion) {
      alert("Por favor, completá los campos obligatorios marcados con (*)");
      return;
    }

    // 2. Creamos la estructura exacta que lee tu tabla de pacientes
    const nuevoPaciente = {
      id: `temp-${Date.now()}`, // Generamos un ID único temporal
      name: `${formData.nombre} ${formData.apellido}`,
      email: formData.email,
      diagnosis: formData.lesion,
      adherence: 0, // Arranca con 0% de adherencia
      weeklyProgress: 0, // Arranca con 0% de progreso semanal
      status: 'Activo', // Estado por defecto
      lastSession: 'Última sesión: Hoy',
      pendingReview: true // Le ponemos true para que salga el puntito naranja indicando que es nuevo
    };

    // Agregamos el paciente nuevo al inicio de nuestra lista temporal
    setPacientesTemporales([nuevoPaciente, ...pacientesTemporales]);

    // Limpiamos el formulario y cerramos el modal
    setIsModalOpen(false);
    setFormData({ nombre: '', apellido: '', email: '', lesion: '', semanas: '', notas: '' });
  };

  // 3. Juntamos la lista temporal con la lista original que trae tu hook
  const todosLosPacientes = [...pacientesTemporales, ...filtered];

  return (
    <View style={s.root}>
      <WebSidebarKine />

      <View style={s.main}>
        {/* Topbar */}
        <View style={s.topbar}>
          <View nativeID="tutorial-title">
            <Text style={s.pageTitle}>Mis Pacientes</Text>
            <Text style={s.pageSub}>Gestioná y monitoreá el progreso de tus pacientes</Text>
          </View>
          
          <View nativeID="tutorial-add-patient">
            <TouchableOpacity 
              style={s.addBtn} 
              activeOpacity={0.8}
              onPress={() => setIsModalOpen(true)}
            >
              <Ionicons name="add" size={18} color={C.white} />
              <Text style={s.addBtnText}>Agregar paciente</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Toolbar: búsqueda + filtros */}
        <View style={s.toolbar}>
          <View style={s.searchWrap}>
            <Ionicons name="search-outline" size={18} color={C.gray400} style={{ marginRight: 8 }} />
            <TextInput
              style={s.searchInput}
              placeholder="Buscar por nombre o diagnóstico..."
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
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[s.filterBtn, active && s.filterBtnActive]}
                  onPress={() => setFilter(f)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.filterText, active && s.filterTextActive]}>
                    {FILTER_LABELS[f]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Tabla de pacientes */}
        <ScrollView style={s.tableWrap} showsVerticalScrollIndicator={false}>
          {/* Cabecera */}
          <View style={s.tableHead}>
            <Text style={[s.th, { flex: 2 }]}>Paciente</Text>
            <Text style={[s.th, { flex: 2 }]}>Diagnóstico</Text>
            <Text style={[s.th, { flex: 1 }]}>Adherencia</Text>
            <Text style={[s.th, { flex: 1 }]}>Progreso</Text>
            <Text style={[s.th, { flex: 1 }]}>Estado</Text>
            <Text style={[s.th, { flex: 1 }]}>Última sesión</Text>
            <View style={{ width: 80 }} />
          </View>

          {/* Usamos todosLosPacientes en lugar de filtered */}
          {todosLosPacientes.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="people-outline" size={48} color={C.gray200} />
              <Text style={s.emptyText}>No se encontraron pacientes</Text>
            </View>
          ) : (
            todosLosPacientes.map((p, i) => {
              const aColor = adherenceColor(p.adherence);
              return (
                <View 
                  key={p.id} 
                  nativeID={i === 0 ? 'tutorial-patient-row' : undefined}
                  style={[s.tableRow, i % 2 === 1 && s.tableRowAlt]}
                >
                  {/* Avatar + nombre */}
                  <View style={[s.td, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                    <View style={s.avatar}>
                      <Text style={s.avatarText}>
                        {p.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </Text>
                    </View>
                    <View>
                      <Text style={s.patientName}>{p.name}</Text>
                      <Text style={s.patientEmail}>{p.email}</Text>
                    </View>
                    {p.pendingReview && (
                      <View style={s.pendingDot} />
                    )}
                  </View>

                  {/* Diagnóstico */}
                  <View style={[s.td, { flex: 2 }]}>
                    <Text style={s.diagText}>{p.diagnosis}</Text>
                  </View>

                  {/* Adherencia */}
                  <View style={[s.td, { flex: 1 }]}>
                    <Text style={[s.adherenceVal, { color: aColor }]}>{p.adherence}%</Text>
                    <View style={s.progressBg}>
                      <View style={[s.progressFill, { width: `${p.adherence}%` as any, backgroundColor: aColor }]} />
                    </View>
                  </View>

                  {/* Progreso semanal */}
                  <View style={[s.td, { flex: 1 }]}>
                    <Text style={[s.adherenceVal, { color: C.turquoise }]}>{p.weeklyProgress}%</Text>
                    <View style={s.progressBg}>
                      <View style={[s.progressFill, { width: `${p.weeklyProgress}%` as any, backgroundColor: C.turquoise }]} />
                    </View>
                  </View>

                  {/* Estado */}
                  <View style={[s.td, { flex: 1 }]}>
                    <View style={[
                      s.statusBadge,
                      { backgroundColor: p.status === 'Activo' ? C.turquoiseDim : C.gray100 },
                    ]}>
                      <Text style={[
                        s.statusText,
                        { color: p.status === 'Activo' ? C.turquoise : C.gray500 },
                      ]}>
                        {p.status}
                      </Text>
                    </View>
                  </View>

                  {/* Última sesión */}
                  <View style={[s.td, { flex: 1 }]}>
                    <Text style={s.sessionText}>{p.lastSession.replace('Última sesión: ', '')}</Text>
                  </View>

                  {/* Acción */}
                  <TouchableOpacity
                    style={s.viewBtn}
                    onPress={() => goToPatient(p.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={s.viewBtnText}>Ver</Text>
                    <Ionicons name="chevron-forward" size={14} color={C.turquoise} />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* Modal para Agregar Paciente */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Agregar Nuevo Paciente</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={24} color={C.gray500} />
              </TouchableOpacity>
            </View>

            <ScrollView style={s.modalBody} showsVerticalScrollIndicator={false}>
              
              <View style={s.formRow}>
                <View style={s.inputGroup}>
                  <Text style={s.label}>Nombre *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Ej: Juan"
                    placeholderTextColor={C.gray400}
                    value={formData.nombre}
                    onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  />
                </View>

                <View style={s.inputGroup}>
                  <Text style={s.label}>Apellido *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Ej: Pérez"
                    placeholderTextColor={C.gray400}
                    value={formData.apellido}
                    onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                  />
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Email *</Text>
                <TextInput
                  style={s.input}
                  placeholder="paciente@email.com"
                  placeholderTextColor={C.gray400}
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
              </View>

              <View style={s.formRow}>
                <View style={[s.inputGroup, { flex: 2 }]}>
                  <Text style={s.label}>Lesión o Diagnóstico *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Ej: Esguince de tobillo"
                    placeholderTextColor={C.gray400}
                    value={formData.lesion}
                    onChangeText={(text) => setFormData({ ...formData, lesion: text })}
                  />
                </View>

                <View style={[s.inputGroup, { flex: 1 }]}>
                  <Text style={s.label}>Tiempo (Semanas) *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Ej: 4"
                    placeholderTextColor={C.gray400}
                    keyboardType="numeric"
                    value={formData.semanas}
                    onChangeText={(text) => setFormData({ ...formData, semanas: text })}
                  />
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Notas Médicas</Text>
                <TextInput
                  style={[s.input, s.textArea]}
                  placeholder="Información adicional sobre el tratamiento..."
                  placeholderTextColor={C.gray400}
                  multiline={true}
                  numberOfLines={4}
                  value={formData.notas}
                  onChangeText={(text) => setFormData({ ...formData, notas: text })}
                />
              </View>

            </ScrollView>

            <View style={s.modalFooter}>
              <TouchableOpacity 
                style={s.btnCancel} 
                onPress={() => setIsModalOpen(false)}
                activeOpacity={0.7}
              >
                <Text style={s.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={s.btnSubmit} 
                onPress={handleAgregarPaciente}
                activeOpacity={0.8}
              >
                <Text style={s.btnSubmitText}>Agregar Paciente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

// ... los estilos permanecen exactamente igual
const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', minHeight: '100vh' as any, backgroundColor: C.bg },
  main: { flex: 1, flexDirection: 'column', overflow: 'hidden' },
  topbar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 36, paddingTop: 32, paddingBottom: 20, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  pageTitle: { color: C.navy, fontSize: 26, fontWeight: '800' },
  pageSub: { color: C.gray400, fontSize: 13, marginTop: 3 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.turquoise, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  addBtnText: { color: C.white, fontSize: 14, fontWeight: '600' },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 36, paddingVertical: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 10, paddingHorizontal: 14, height: 40, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, fontSize: 14, color: C.navy, outlineStyle: 'none' as any },
  filters: { flexDirection: 'row', gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  filterBtnActive: { backgroundColor: C.turquoise, borderColor: C.turquoise },
  filterText: { fontSize: 13, fontWeight: '500', color: C.gray500 },
  filterTextActive: { color: C.white },
  tableWrap: { flex: 1, paddingHorizontal: 36, paddingTop: 16 },
  tableHead: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: C.bg, borderRadius: 8, marginBottom: 4 },
  th: { fontSize: 11, fontWeight: '700', color: C.gray400, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, backgroundColor: C.white, borderRadius: 12, marginBottom: 4 },
  tableRowAlt: { backgroundColor: '#FAFAFA' },
  td: { justifyContent: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.turquoiseDim, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.turquoise, fontWeight: '700', fontSize: 12 },
  pendingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.amber },
  patientName: { color: C.navy, fontSize: 13, fontWeight: '600' },
  patientEmail: { color: C.gray400, fontSize: 11, marginTop: 1 },
  diagText: { color: C.gray500, fontSize: 13 },
  adherenceVal: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  progressBg: { height: 5, backgroundColor: C.gray100, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 3 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
  sessionText: { color: C.gray500, fontSize: 12 },
  viewBtn: { width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 3 },
  viewBtnText: { color: C.turquoise, fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 80, gap: 12 },
  emptyText: { color: C.gray400, fontSize: 15 },

  // Estilos del Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,43,73,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 550, backgroundColor: C.white, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  modalTitle: { fontSize: 20, fontWeight: '800', color: C.navy },
  modalBody: { padding: 24, maxHeight: '70vh' as any },
  formRow: { flexDirection: 'row', gap: 16 },
  inputGroup: { flex: 1, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: C.navy, marginBottom: 6 },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: C.navy, outlineStyle: 'none' as any },
  textArea: { height: 100, textAlignVertical: 'top' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: '#FAFAFA' },
  btnCancel: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.white },
  btnCancelText: { fontSize: 14, fontWeight: '600', color: C.gray500 },
  btnSubmit: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, backgroundColor: C.turquoise },
  btnSubmitText: { fontSize: 14, fontWeight: '600', color: C.white },
});