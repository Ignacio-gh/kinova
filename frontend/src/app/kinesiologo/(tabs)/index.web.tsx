import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { useMisPacientes, FILTERS, FILTER_LABELS } from '@/hooks/use-mis-pacientes';
import { api } from '@/services/api';
import React from 'react';
import { useTutorial } from '@/context/TutorialContext'; // Tu estado global del tutorial
import MockIndex from '@/mock/mock-index.web';




const C = {
  bg: '#F1F5F9',
  white: '#FFFFFF',
  navy: '#002B49',
  turquoise: '#00A896',
  turquoiseDim: 'rgba(0,168,150,0.10)',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  border: '#E5E7EB',
  red: '#EF4444',
  green: '#16A34A',
  amber: '#F59E0B',
};

const adherenceColor = (v: number) =>
  v >= 90 ? C.green : v >= 70 ? C.amber : C.red;

const today = new Date().toISOString().split('T')[0];

export default function MisPacientesWeb() {
   const { isTutorialActive } = useTutorial();
  if (isTutorialActive) {
    return <MockIndex />;
  }
  const { search, setSearch, filter, setFilter, filtered, goToPatient, refetch } = useMisPacientes();

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [createdPassword, setCreatedPassword] = useState('');
  const [createdEmail, setCreatedEmail] = useState('');
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', diagnosis: '',
    treatment_weeks: '12', treatment_start_date: today,
    phone: '', notes: '',
  });

  const setField = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const closeModal = () => {
    setShowModal(false);
    setCreatedPassword('');
    setCreatedEmail('');
    setFormError('');
    setForm({ full_name: '', email: '', password: '', diagnosis: '', treatment_weeks: '12', treatment_start_date: today, phone: '', notes: '' });
  };

  const handleCreate = async () => {
    setFormError('');
    if (!form.full_name.trim() || !form.email.trim() || !form.diagnosis.trim()) {
      setFormError('Nombre, email y diagnóstico son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      const response: any = await api.post('/api/v1/patients', {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim() || undefined,
        diagnosis: form.diagnosis.trim(),
        treatment_weeks: Number(form.treatment_weeks) || 12,
        treatment_start_date: form.treatment_start_date || today,
        phone: form.phone.trim() || null,
        notes: form.notes.trim() || null,
      });
      setCreatedPassword(response.temp_password ?? form.password ?? '');
      setCreatedEmail(form.email.trim().toLowerCase());
      refetch();
    } catch (e: any) {
      setFormError(e.message ?? 'Error al crear paciente.');
    } finally {
      setSaving(false);
    }
  };

  

  return (
    <View style={s.root}>
      <WebSidebarKine />

      <View style={s.main}>
        {/* Topbar */}
        <View style={s.topbar}>
          <View>
            <Text style={s.pageTitle}>Mis Pacientes</Text>
            <Text style={s.pageSub}>Gestioná y monitoreá el progreso de tus pacientes</Text>
          </View>
          <TouchableOpacity style={s.addBtn} activeOpacity={0.8} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={18} color={C.white} />
            <Text style={s.addBtnText}>Agregar paciente</Text>
          </TouchableOpacity>
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

          {filtered.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="people-outline" size={48} color={C.gray200} />
              <Text style={s.emptyText}>No se encontraron pacientes</Text>
            </View>
          ) : (
            filtered.map((p, i) => {
              const aColor = adherenceColor(p.adherence);
              return (
                <View key={p.id} style={[s.tableRow, i % 2 === 1 && s.tableRowAlt]}>
                  {/* Avatar + nombre */}
                  <View style={[s.td, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                    <View style={s.avatar}>
                      <Text style={s.avatarText}>
                        {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
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

      {/* Modal crear paciente */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={s.overlay}>
          <View style={s.modalCard}>
            {createdPassword ? (
              /* ── Pantalla de éxito: mostrar contraseña ── */
              <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Ionicons name="checkmark-circle" size={32} color="#16A34A" />
                </View>
                <Text style={{ color: C.navy, fontSize: 20, fontWeight: '800', marginBottom: 6 }}>Paciente creado</Text>
                <Text style={{ color: C.gray500, fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
                  Compartí estos datos con el paciente para que pueda ingresar a la app.
                </Text>
                <View style={{ backgroundColor: C.bg, borderRadius: 12, padding: 16, width: '100%', marginBottom: 12 }}>
                  <Text style={{ color: C.gray400, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>EMAIL DE ACCESO</Text>
                  <Text style={{ color: C.navy, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>{createdEmail}</Text>
                </View>
                <View style={{ backgroundColor: C.bg, borderRadius: 12, padding: 16, width: '100%', marginBottom: 24 }}>
                  <Text style={{ color: C.gray400, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>CONTRASEÑA DE ACCESO</Text>
                  <Text style={{ color: C.navy, fontSize: 22, fontWeight: '800', letterSpacing: 2, textAlign: 'center' }}>{createdPassword}</Text>
                </View>
                <TouchableOpacity style={s.saveBtn} onPress={closeModal}>
                  <Text style={s.saveBtnText}>Entendido</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* ── Formulario ── */
              <>
                <View style={s.modalHeader}>
                  <Text style={s.modalTitle}>Nuevo paciente</Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="close" size={22} color={C.gray400} />
                  </TouchableOpacity>
                </View>

                <View style={s.row2}>
                  <View style={[s.fieldGroup, { flex: 1 }]}>
                    <Text style={s.fieldLabel}>Nombre completo *</Text>
                    <TextInput style={s.input} placeholder="Juan Pérez" value={form.full_name} onChangeText={setField('full_name')} />
                  </View>
                  <View style={[s.fieldGroup, { flex: 1 }]}>
                    <Text style={s.fieldLabel}>Email *</Text>
                    <TextInput style={s.input} placeholder="paciente@email.com" value={form.email} onChangeText={setField('email')} autoCapitalize="none" keyboardType="email-address" />
                  </View>
                </View>

                <View style={s.row2}>
                  <View style={[s.fieldGroup, { flex: 1 }]}>
                    <Text style={s.fieldLabel}>Contraseña (opcional — se genera automáticamente)</Text>
                    <TextInput style={s.input} placeholder="Dejar vacío para generar" value={form.password} onChangeText={setField('password')} secureTextEntry />
                  </View>
                  <View style={[s.fieldGroup, { flex: 1 }]}>
                    <Text style={s.fieldLabel}>Diagnóstico *</Text>
                    <TextInput style={s.input} placeholder="Lesión de rodilla..." value={form.diagnosis} onChangeText={setField('diagnosis')} />
                  </View>
                </View>

                <View style={s.row2}>
                  <View style={[s.fieldGroup, { flex: 1 }]}>
                    <Text style={s.fieldLabel}>Semanas de tratamiento</Text>
                    <TextInput style={s.input} placeholder="12" value={form.treatment_weeks} onChangeText={setField('treatment_weeks')} keyboardType="numeric" />
                  </View>
                  <View style={[s.fieldGroup, { flex: 1 }]}>
                    <Text style={s.fieldLabel}>Inicio de tratamiento</Text>
                    <TextInput style={s.input} placeholder="YYYY-MM-DD" value={form.treatment_start_date} onChangeText={setField('treatment_start_date')} />
                  </View>
                </View>

                <View style={s.row2}>
                  <View style={[s.fieldGroup, { flex: 1 }]}>
                    <Text style={s.fieldLabel}>Teléfono (opcional)</Text>
                    <TextInput style={s.input} placeholder="+54 11 1234-5678" value={form.phone} onChangeText={setField('phone')} keyboardType="phone-pad" />
                  </View>
                  <View style={[s.fieldGroup, { flex: 1 }]}>
                    <Text style={s.fieldLabel}>Notas (opcional)</Text>
                    <TextInput style={s.input} placeholder="Antecedentes..." value={form.notes} onChangeText={setField('notes')} />
                  </View>
                </View>

                {!!formError && (
                  <View style={s.errorBox}>
                    <Ionicons name="alert-circle-outline" size={15} color="#DC2626" />
                    <Text style={s.errorText}>{formError}</Text>
                  </View>
                )}

                <View style={s.modalFooter}>
                  <TouchableOpacity style={s.cancelBtn} onPress={closeModal}>
                    <Text style={s.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.6 }]} onPress={handleCreate} disabled={saving}>
                    <Text style={s.saveBtnText}>{saving ? 'Guardando...' : 'Crear paciente'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    backgroundColor: C.white,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  pageTitle: { color: C.navy, fontSize: 26, fontWeight: '800' },
  pageSub: { color: C.gray400, fontSize: 13, marginTop: 3 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.turquoise, borderRadius: 10,
    paddingHorizontal: 18, paddingVertical: 10,
  },
  addBtnText: { color: C.white, fontSize: 14, fontWeight: '600' },

  toolbar: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingHorizontal: 36, paddingVertical: 16,
    backgroundColor: C.white,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bg, borderRadius: 10,
    paddingHorizontal: 14, height: 40,
    borderWidth: 1, borderColor: C.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.navy, outlineStyle: 'none' as any },
  filters: { flexDirection: 'row', gap: 8 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.turquoise, borderColor: C.turquoise },
  filterText: { fontSize: 13, fontWeight: '500', color: C.gray500 },
  filterTextActive: { color: C.white },

  tableWrap: { flex: 1, paddingHorizontal: 36, paddingTop: 16 },
  tableHead: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 16,
    backgroundColor: C.bg,
    borderRadius: 8, marginBottom: 4,
  },
  th: { fontSize: 11, fontWeight: '700', color: C.gray400, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: C.white, borderRadius: 12, marginBottom: 4,
  },
  tableRowAlt: { backgroundColor: '#FAFAFA' },
  td: { justifyContent: 'center' },

  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.turquoiseDim,
    alignItems: 'center', justifyContent: 'center',
  },
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
  viewBtn: {
    width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 3,
  },
  viewBtnText: { color: C.turquoise, fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 80, gap: 12 },
  emptyText: { color: C.gray400, fontSize: 15 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: C.white, borderRadius: 20, padding: 28, width: 600, maxWidth: '95%' as any },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: C.navy, fontSize: 20, fontWeight: '800' },
  row2: { flexDirection: 'row', gap: 12 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { color: C.navy, fontSize: 12, fontWeight: '600', marginBottom: 5 },
  input: {
    borderWidth: 1.5, borderColor: C.border, borderRadius: 10,
    height: 42, paddingHorizontal: 12, fontSize: 14, color: C.navy,
    backgroundColor: C.white, outlineStyle: 'none' as any,
  },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 8, padding: 10, marginBottom: 12 },
  errorText: { color: '#DC2626', fontSize: 12, flex: 1 },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: C.border },
  cancelBtnText: { color: C.gray500, fontSize: 14, fontWeight: '600' },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10, backgroundColor: C.turquoise },
  saveBtnText: { color: C.white, fontSize: 14, fontWeight: '700' },
});
