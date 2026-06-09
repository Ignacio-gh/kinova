import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
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

type NavItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  path: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', icon: 'home-outline', path: '/paciente' },
  { label: 'Mi Calendario', icon: 'calendar-outline', path: '/paciente/calendario' },
  { label: 'Historial', icon: 'time-outline', path: '/paciente/historial' },
];

export function WebSidebarPaciente() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/paciente') return pathname === '/paciente';
    return pathname.startsWith(path);
  };

  // Función para disparar el evento global del tutorial
  const iniciarTutorial = () => {
    if (typeof window !== 'undefined') {
      // Disparamos un evento específico para pacientes
      window.dispatchEvent(new Event('open-tutorial-paciente'));
    }
  };

  return (
    <View style={s.sidebar}>
      {/* Logo */}
      <View style={s.logo}>
        <View style={s.logoCircle}>
          <Text style={s.logoLetter}>K</Text>
        </View>
        <View>
          <Text style={s.logoText}>Kinova</Text>
          <Text style={s.logoSub}>Portal Paciente</Text>
        </View>
      </View>

      <View style={s.divider} />

      {/* Info del paciente */}
      <View style={s.patientCard}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>CR</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.patientName}>Carlos R.</Text>
          <Text style={s.patientSub}>Rehabilitación rodilla</Text>
        </View>
      </View>

      <View style={[s.divider, { marginTop: 12 }]} />

      {/* Nav */}
      <View style={s.nav}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <TouchableOpacity
              key={item.path}
              style={[s.navItem, active && s.navItemActive]}
              onPress={() => router.push(item.path as never)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? C.active : C.text}
              />
              <Text style={[s.navLabel, active && s.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={s.footer}>
        <View style={s.divider} />
        
        {/* Botón de Ayuda (Nuevo) */}
        <TouchableOpacity
          style={s.helpBtn}
          onPress={iniciarTutorial}
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle-outline" size={18} color={C.textMuted} />
          <Text style={s.helpText}>Ver tutorial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.logoutBtn}
          onPress={() => router.replace('/')}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={s.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  sidebar: {
    width: 230,
    backgroundColor: C.sidebar,
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: C.border,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: C.turquoise,
    fontWeight: '700',
    fontSize: 16,
  },
  logoText: {
    color: C.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoSub: {
    color: C.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,168,150,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: C.active,
    fontWeight: '700',
    fontSize: 12,
  },
  patientName: {
    color: C.white,
    fontSize: 13,
    fontWeight: '600',
  },
  patientSub: {
    color: C.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 12,
  },
  nav: {
    flex: 1,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: C.activeBg,
  },
  navLabel: {
    color: C.text,
    fontSize: 14,
    fontWeight: '500',
  },
  navLabelActive: {
    color: C.active,
    fontWeight: '600',
  },
  footer: {
    gap: 0,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  helpText: {
    color: C.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
});