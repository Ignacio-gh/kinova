import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const C = {
  sidebar: '#071220',
  active: '#00A896',
  activeBg: 'rgba(0,168,150,0.12)',
  text: '#CBD5E1',
  textMuted: '#64748B',
  border: 'rgba(255,255,255,0.06)',
  turquoise: '#00A896',
  white: '#FFFFFF',
};

const NAV_ITEMS: { label: string; icon: any; path: string; isTutorial?: boolean }[] = [
  { label: 'Pacientes', icon: 'people-outline', path: '/kinesiologo' },
  { label: 'Biblioteca', icon: 'barbell-outline', path: '/kinesiologo/biblioteca' },
  { label: 'Mi Perfil', icon: 'person-circle-outline', path: '/kinesiologo/perfil' },
  { label: 'Ver Tutorial', icon: 'help-circle-outline', path: '', isTutorial: true },
];

export function WebSidebarKine() {
  const router = useRouter();
  const pathname = usePathname();

  // Dispara una señal global que el _layout.tsx va a escuchar
  const openTutorial = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('open-tutorial'));
  }
};

  

  const isActive = (path: string) => {
    if (path === '/kinesiologo') return pathname === '/kinesiologo';
    return pathname.startsWith(path);
  };

  return (
    <View nativeID="tutorial-sidebar" style={s.sidebar}>
      {/* Logo - PASO 1 (ID Nativo) */}
      <View nativeID="tutorial-logo" style={s.logo}>
        <View style={s.logoCircle}>
          <Text style={s.logoLetter}>K</Text>
        </View>
        <View>
          <Text style={s.logoText}>Kinova</Text>
          <Text style={s.logoSub}>Portal Profesional</Text>
        </View>
      </View>

      <View style={s.divider} />

      <View style={s.nav}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path) && !item.isTutorial;
          if (item.isTutorial) {
            return (
              <TouchableOpacity
                key={item.label}
                style={s.navItem}
                onPress={openTutorial}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={20} color={C.text} />
                <Text style={s.navLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          }
          return (
            <Link key={item.label} href={item.path as never} style={{ textDecorationLine: 'none' }}>
              <View style={[s.navItem, active && s.navItemActive]}>
                <Ionicons name={item.icon} size={20} color={active ? C.active : C.text} />
                <Text style={[s.navLabel, active && s.navLabelActive]}>{item.label}</Text>
              </View>
            </Link>
          );
        })}
      </View>
      
      <View style={s.footer}>
        <View style={s.divider} />
        <TouchableOpacity style={s.logoutBtn} onPress={() => router.replace('/')} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={s.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  sidebar: { width: 230, backgroundColor: C.sidebar, paddingTop: 28, paddingHorizontal: 16, paddingBottom: 24, flexDirection: 'column', borderRightWidth: 1, borderRightColor: C.border },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8, marginBottom: 24 },
  logoCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: C.turquoise, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { color: C.turquoise, fontWeight: '700', fontSize: 16 },
  logoText: { color: C.white, fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  logoSub: { color: C.textMuted, fontSize: 10, marginTop: 1 },
  divider: { height: 1, backgroundColor: C.border, marginBottom: 12 },
  nav: { flex: 1, gap: 4 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 10 },
  navItemActive: { backgroundColor: C.activeBg },
  navLabel: { color: C.text, fontSize: 14, fontWeight: '500' },
  navLabelActive: { color: C.active, fontWeight: '600' },
  footer: { gap: 0 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 10, marginTop: 4 },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: '500' },
});