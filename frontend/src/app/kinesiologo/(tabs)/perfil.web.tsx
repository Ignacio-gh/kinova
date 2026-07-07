import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SkeletonBox } from '@/components/ui/skeleton';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarKine } from '@/components/web/web-sidebar-kine';
import { useIsMobileBrowser } from '@/hooks/use-mobile-browser';
import MobilePerfil from './perfil.tsx';
import { usePerfilKine } from '@/hooks/use-perfil-kine';
import { useRouter } from 'expo-router';
import { KinovaColors } from '@/constants/colors';

const C = {
  ...KinovaColors,
  redBg: '#FFF1F2', redBorder: '#FECDD3',
};

const PERFIL_AJUSTES = [
  { icon: 'notifications-outline' as const, label: 'Notificaciones' },
  { icon: 'lock-closed-outline' as const, label: 'Cambiar contraseña' },
  { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte' },
];

export default function MiPerfilWeb() {
  const isMobile = useIsMobileBrowser();
  const { perfilInfo, loading, handleLogout, kineStats } = usePerfilKine();
  const router = useRouter();

  if (isMobile) return <MobilePerfil />;

  const name = perfilInfo.find((i) => i.label === 'Nombre completo')?.value ?? '';
  const email = perfilInfo.find((i) => i.label === 'Correo')?.value ?? '';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'KN';

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
            <View style={s.columns}>
              <View style={s.colLeft}>
                <View style={[s.avatarCard, { gap: 16 }]}>
                  <SkeletonBox width={80} height={80} radius={40} />
                  <SkeletonBox width={140} height={18} radius={6} delay={60} />
                  <SkeletonBox width={110} height={13} radius={5} delay={120} />
                  <SkeletonBox width={120} height={28} radius={20} delay={80} />
                  <View style={{ width: '100%', flexDirection: 'row', backgroundColor: C.bg, borderRadius: 12, padding: 14 }}>
                    {[0, 1, 2].map((i) => (
                      <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                        <SkeletonBox width={36} height={22} radius={5} delay={i * 80} />
                        <SkeletonBox width={50} height={11} radius={4} delay={i * 80 + 40} />
                      </View>
                    ))}
                  </View>
                </View>
                <SkeletonBox width="100%" height={48} radius={12} delay={200} />
              </View>
              <View style={s.colRight}>
                <View style={s.section}>
                  <SkeletonBox width={180} height={16} radius={6} style={{ margin: 20 }} />
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={[s.infoRow]}>
                      <SkeletonBox width={36} height={36} radius={9} delay={i * 60} />
                      <View style={{ flex: 1, gap: 6 }}>
                        <SkeletonBox width="35%" height={11} radius={4} delay={i * 60 + 40} />
                        <SkeletonBox width="60%" height={14} radius={5} delay={i * 60 + 80} />
                      </View>
                    </View>
                  ))}
                </View>
                <View style={s.section}>
                  <SkeletonBox width={160} height={16} radius={6} style={{ margin: 20 }} />
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={[s.settingRow]}>
                      <SkeletonBox width={36} height={36} radius={9} delay={i * 60} />
                      <SkeletonBox width="55%" height={14} radius={5} delay={i * 60 + 60} />
                    </View>
                  ))}
                </View>
              </View>
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
                      <Text style={s.statVal}>{kineStats?.active_patients ?? '—'}</Text>
                      <Text style={s.statLabel}>Pacientes</Text>
                    </View>
                    <View style={s.statDivider} />
                    <View style={s.statItem}>
                      <Text style={s.statVal}>{kineStats?.total_sessions ?? '—'}</Text>
                      <Text style={s.statLabel}>Sesiones</Text>
                    </View>
                    <View style={s.statDivider} />
                    <View style={s.statItem}>
                      <Text style={s.statVal}>
                        {kineStats ? `${kineStats.avg_adherence}%` : '—'}
                      </Text>
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
                      <TouchableOpacity 
                        key={item.label} 
                        style={s.settingRow} 
                        activeOpacity={0.7}
                        onPress={() => {
                          // Condición para navegar a la pantalla de ayuda
                          if (item.label === 'Ayuda y soporte') {
                            // IMPORTANTE: Asegúrate de que '/ayuda' coincida con la ruta real de tu archivo AyudaSoporteScreen
                            router.push('/ayuda'); 
                          }
                        }}
                      >
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
