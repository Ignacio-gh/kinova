import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SkeletonBox } from '@/components/ui/skeleton';
import { Ionicons } from '@expo/vector-icons';
import { WebSidebarPaciente } from '@/components/web/web-sidebar-paciente';
import { useIsMobileBrowser } from '@/hooks/use-mobile-browser';
import MobilePerfil from './perfil.tsx';
import { usePacientePerfil } from '@/hooks/use-paciente-perfil';
import { useRouter } from 'expo-router';
import { KinovaColors } from '@/constants/colors';

const C = {
  ...KinovaColors,
  redBg: '#FFF1F2', redBorder: '#FECDD3',
};

export default function MiPerfilPacienteWeb() {
  const isMobile = useIsMobileBrowser();
  const { profile, handleLogout } = usePacientePerfil();
  const router = useRouter();

  if (isMobile) return <MobilePerfil />;
  const loading = !profile;

  const initials = profile?.full_name
    ?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'PA';

  const isActive = profile?.status === 'activo' || profile?.status === 'active';
  const statusLabel = isActive ? 'Tratamiento Activo' : 'Tratamiento Finalizado';
  const statusColor = isActive ? C.turquoise : C.gray400;
  const statusBg = isActive ? C.turquoiseBg : C.gray100;

  const infoRows = [
    { icon: 'person-outline' as const, label: 'Nombre completo', value: profile?.full_name ?? '...' },
    { icon: 'mail-outline' as const, label: 'Correo', value: profile?.email ?? '...' },
  ];

  const tratamientoRows = [
    { icon: 'medical-outline' as const, label: 'Diagnóstico', value: profile?.diagnosis ?? '...' },
    { icon: 'person-circle-outline' as const, label: 'Kinesiólogo asignado', value: profile?.kinesiologo_name ?? '...' },
    { icon: 'calendar-outline' as const, label: 'Duración del tratamiento', value: profile?.treatment_weeks ? `${profile.treatment_weeks} semanas` : '...' },
    { icon: 'trending-up-outline' as const, label: 'Semana actual', value: profile?.current_week ? `Semana ${profile.current_week} de ${profile.treatment_weeks}` : '...' },
  ];

  return (
    <View style={s.root}>
      <WebSidebarPaciente />

      <View style={s.main}>
        <View style={s.topbar}>
          <Text style={s.pageTitle}>Mi Perfil</Text>
          <Text style={s.pageSub}>Tu información personal y de tratamiento</Text>
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
                  <View style={{ width: '100%', gap: 8 }}>
                    <SkeletonBox width="50%" height={12} radius={5} delay={140} />
                    <SkeletonBox width="70%" height={14} radius={5} delay={180} />
                    <SkeletonBox width="100%" height={8} radius={4} delay={220} />
                  </View>
                </View>
                <SkeletonBox width="100%" height={48} radius={12} delay={200} />
              </View>
              <View style={s.colRight}>
                <View style={s.section}>
                  <SkeletonBox width={160} height={16} radius={6} style={{ margin: 20 }} />
                  {[0, 1].map((i) => (
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
                  <SkeletonBox width={140} height={16} radius={6} style={{ margin: 20 }} />
                  {[0, 1, 2, 3].map((i) => (
                    <View key={i} style={[s.infoRow]}>
                      <SkeletonBox width={36} height={36} radius={9} delay={i * 50} />
                      <View style={{ flex: 1, gap: 6 }}>
                        <SkeletonBox width="30%" height={11} radius={4} delay={i * 50 + 40} />
                        <SkeletonBox width="55%" height={14} radius={5} delay={i * 50 + 80} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={s.columns}>
              {/* Columna izquierda — avatar + logout */}
              <View style={s.colLeft}>
                <View style={s.avatarCard}>
                  <View style={s.avatarCircle}>
                    <Text style={s.avatarText}>{initials}</Text>
                  </View>
                  <Text style={s.profileName}>{profile?.full_name ?? 'Paciente'}</Text>
                  <Text style={s.profileEmail}>{profile?.email}</Text>
                  <View style={[s.roleBadge, { backgroundColor: statusBg }]}>
                    <View style={[s.roleDot, { backgroundColor: statusColor }]} />
                    <Text style={[s.roleText, { color: statusColor }]}>{statusLabel}</Text>
                  </View>

                  {/* Progreso de tratamiento */}
                  <View style={s.progressCard}>
                    <Text style={s.progressLabel}>Progreso del tratamiento</Text>
                    <Text style={s.progressFraction}>
                      Semana {profile?.current_week ?? 0} / {profile?.treatment_weeks ?? 0}
                    </Text>
                    <View style={s.progressBg}>
                      <View
                        style={[
                          s.progressFill,
                          {
                            width: `${Math.min(
                              100,
                              ((profile?.current_week ?? 0) / (profile?.treatment_weeks ?? 1)) * 100,
                            )}%` as any,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                  <Ionicons name="log-out-outline" size={18} color={C.red} />
                  <Text style={s.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>

              {/* Columna derecha — info + tratamiento + ajustes */}
              <View style={s.colRight}>
                <View style={s.section}>
                  <Text style={s.sectionTitle}>Información personal</Text>
                  <View>
                    {infoRows.map((item) => (
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
                  <Text style={s.sectionTitle}>Mi tratamiento</Text>
                  <View>
                    {tratamientoRows.map((item) => (
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
                  <TouchableOpacity
                    style={s.settingRow}
                    activeOpacity={0.7}
                    onPress={() => router.push('/ayuda')}
                  >
                    <View style={s.infoIcon}>
                      <Ionicons name="help-circle-outline" size={16} color={C.turquoise} />
                    </View>
                    <Text style={s.settingLabel}>Ayuda y soporte</Text>
                    <Ionicons name="chevron-forward" size={16} color={C.gray400} />
                  </TouchableOpacity>
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
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 16 },
  roleDot: { width: 6, height: 6, borderRadius: 3 },
  roleText: { fontSize: 12, fontWeight: '600' },
  progressCard: { width: '100%', gap: 8 },
  progressLabel: { color: C.gray400, fontSize: 12 },
  progressFraction: { color: C.navy, fontSize: 14, fontWeight: '700' },
  progressBg: { height: 8, backgroundColor: C.gray100, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: C.turquoise, borderRadius: 4 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.redBg, borderWidth: 1, borderColor: C.redBorder, borderRadius: 12, paddingVertical: 14 },
  logoutText: { color: C.red, fontSize: 14, fontWeight: '600' },

  colRight: { flex: 1, gap: 20 },
  section: { backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  sectionTitle: { color: C.navy, fontSize: 14, fontWeight: '700', padding: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  infoIcon: { width: 36, height: 36, borderRadius: 9, backgroundColor: C.turquoiseBg, alignItems: 'center', justifyContent: 'center' },
  infoBody: { flex: 1 },
  infoLabel: { color: C.gray400, fontSize: 11, fontWeight: '500' },
  infoValue: { color: C.navy, fontSize: 14, fontWeight: '600', marginTop: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  settingLabel: { flex: 1, color: C.navy, fontSize: 14, fontWeight: '500' },
});
