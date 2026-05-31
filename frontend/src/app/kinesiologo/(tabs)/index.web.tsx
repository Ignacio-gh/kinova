import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { useMisPacientes, FILTERS, FILTER_LABELS } from '@/hooks/use-mis-pacientes';

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

export default function MisPacientesWeb() {
  const { search, setSearch, filter, setFilter, filtered, goToPatient } = useMisPacientes();

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
          <TouchableOpacity style={s.addBtn} activeOpacity={0.8}>
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
});
