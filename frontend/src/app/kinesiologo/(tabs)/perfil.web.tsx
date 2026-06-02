import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { usePerfilKine } from '@/hooks/use-perfil-kine';
import { useMisPacientes } from '@/hooks/use-mis-pacientes';

const C = {
  bg: '#F1F5F9', white: '#FFFFFF', navy: '#002B49',
  turquoise: '#00A896', turquoiseBg: '#e5f7f5',
  gray100: '#F3F4F6', gray200: '#E5E7EB', gray400: '#9CA3AF',
  gray500: '#6B7280', border: '#E5E7EB',
  red: '#EF4444', redBg: '#FFF1F2', redBorder: '#FECDD3',
};

const PERFIL_AJUSTES = [
  { icon: 'notifications-outline' as const, label: 'Notificaciones' },
  { icon: 'lock-closed-outline' as const, label: 'Cambiar contraseña' },
  { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte' },
];

export default function MiPerfilWeb() {
  const { perfilInfo, loading, handleLogout } = usePerfilKine();
  const { filtered: patients } = useMisPacientes();

  const name = perfilInfo.find((i) => i.label === 'Nombre completo')?.value ?? '';
  const email = perfilInfo.find((i) => i.label === 'Correo')?.value ?? '';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'KN';

  const activeCount = patients.filter((p) => p.status === 'Activo').length;

  return (
    <View style={s.root}>
      <WebSidebarKine />

      <View style={s.main}>
        <View style={s.topbar}>
          <Text style={s.pageTitle}>Mi Perfil</Text>
          <Text style={s.pageSub}>Administrá tu información profesional</Text>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <ActivityIndicator size="large" color={C.turquoise} />
            </View>
          ) : (
            <View style={s.columns}>
              {/* Columna izquierda */}
              <View style={s.colLeft}>
                <View style={s.avatarCard}>
                  <View style={s.avatarCircle}>
                    <Text style={s.avatarText}>{initials}</Text>
                  </View>
                  <Text style={s.profileName}>{name || 'Kinesiólogo'}</Text>
                  <Text style={s.profileEmail}>{email}</Text>
                  <View style={s.roleBadge}>
                    <View style={s.roleDot} />
                    <Text style={s.roleText}>Portal Profesional</Text>
                  </View>

                  <View style={s.statsRow}>
                    <View style={s.statItem}>
                      <Text style={s.statVal}>{activeCount}</Text>
                      <Text style={s.statLabel}>Pacientes</Text>
                    </View>
                    <View style={s.statDivider} />
                    <View style={s.statItem}>
                      <Text style={s.statVal}>—</Text>
                      <Text style={s.statLabel}>Sesiones</Text>
                    </View>
                    <View style={s.statDivider} />
                    <View style={s.statItem}>
                      <Text style={s.statVal}>—</Text>
                      <Text style={s.statLabel}>Adherencia</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                  <Ionicons name="log-out-outline" size={18} color={C.red} />
                  <Text style={s.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>

              {/* Columna derecha */}
              <View style={s.colRight}>
                <View style={s.section}>
                  <Text style={s.sectionTitle}>Información profesional</Text>
                  <View style={s.infoGrid}>
                    {perfilInfo.map((item) => (
                      <View key={item.label} style={s.infoRow}>
                        <View style={s.infoIcon}>
                          <Ionicons name={item.icon} size={16} color={C.turquoise} />
                        </View>
                        <View style={s.infoBody}>
                          <Text style={s.infoLabel}>{item.label}</Text>
                          <Text style={s.infoValue}>{item.value}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={s.section}>
                  <Text style={s.sectionTitle}>Ajustes de la cuenta</Text>
                  <View style={s.infoGrid}>
                    {PERFIL_AJUSTES.map((item) => (
                      <TouchableOpacity key={item.label} style={s.settingRow} activeOpacity={0.7}>
                        <View style={s.infoIcon}>
                          <Ionicons name={item.icon} size={16} color={C.turquoise} />
                        </View>
                        <Text style={s.settingLabel}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={16} color={C.gray400} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
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
  topbar: { paddingHorizontal: 36, paddingTop: 32, paddingBottom: 20, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  pageTitle: { color: C.navy, fontSize: 26, fontWeight: '800' },
  pageSub: { color: C.gray400, fontSize: 13, marginTop: 3 },
  scroll: { flex: 1 },
  scrollContent: { padding: 36 },
  columns: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },

  colLeft: { width: 260, gap: 16 },
  avatarCard: { backgroundColor: C.white, borderRadius: 20, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.turquoiseBg, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { color: C.turquoise, fontWeight: '800', fontSize: 28 },
  profileName: { color: C.navy, fontSize: 18, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  profileEmail: { color: C.gray400, fontSize: 13, marginBottom: 10, textAlign: 'center' },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.turquoiseBg, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 20 },
  roleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.turquoise },
  roleText: { color: C.turquoise, fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', width: '100%', backgroundColor: C.bg, borderRadius: 12, padding: 14, marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { color: C.navy, fontSize: 20, fontWeight: '800' },
  statLabel: { color: C.gray400, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: C.border, marginHorizontal: 8 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.redBg, borderWidth: 1, borderColor: C.redBorder, borderRadius: 12, paddingVertical: 14 },
  logoutText: { color: C.red, fontSize: 14, fontWeight: '600' },

  colRight: { flex: 1, gap: 20 },
  section: { backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  sectionTitle: { color: C.navy, fontSize: 14, fontWeight: '700', padding: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  infoGrid: {},
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  infoIcon: { width: 36, height: 36, borderRadius: 9, backgroundColor: C.turquoiseBg, alignItems: 'center', justifyContent: 'center' },
  infoBody: { flex: 1 },
  infoLabel: { color: C.gray400, fontSize: 11, fontWeight: '500' },
  infoValue: { color: C.navy, fontSize: 14, fontWeight: '600', marginTop: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  settingLabel: { flex: 1, color: C.navy, fontSize: 14, fontWeight: '500' },
});
