import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { useBiblioteca, CATEGORY_FILTERS } from '@/hooks/use-biblioteca';

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

export default function BibliotecaWeb() {
  const { search, setSearch, filter, setFilter, filtered } = useBiblioteca();

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
          {filtered.length === 0 ? (
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
                      <TouchableOpacity style={s.assignBtn} activeOpacity={0.8}>
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
});
