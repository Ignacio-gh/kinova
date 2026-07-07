import { View, Text, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const C = {
  active: '#00A896',
  inactive: '#9CA3AF',
  border: '#E5E7EB',
  white: '#FFFFFF',
};

const ITEMS: { label: string; icon: keyof typeof Ionicons.glyphMap; path: string }[] = [
  { label: 'Pacientes', icon: 'people-outline', path: '/kinesiologo' },
  { label: 'Biblioteca', icon: 'barbell-outline', path: '/kinesiologo/biblioteca' },
  { label: 'Mi Perfil', icon: 'person-circle-outline', path: '/kinesiologo/perfil' },
];

// Barra de navegación inferior para pantallas del kinesiólogo que quedan
// fuera del grupo (tabs) de expo-router (p. ej. el detalle de un paciente),
// donde el <Tabs> del layout no envuelve la pantalla automáticamente.
export function MobileTabBarKine() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/kinesiologo') {
      return pathname === '/kinesiologo' || pathname.startsWith('/kinesiologo/paciente');
    }
    return pathname.startsWith(path);
  };

  return (
    <View style={s.bar}>
      {ITEMS.map((item) => {
        const active = isActive(item.path);
        return (
          <Link key={item.label} href={item.path as never} style={s.link}>
            <View style={s.item}>
              <Ionicons name={item.icon} size={22} color={active ? C.active : C.inactive} />
              <Text style={[s.label, active && s.labelActive]}>{item.label}</Text>
            </View>
          </Link>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 6,
    height: 'calc(62px + env(safe-area-inset-bottom, 0px))' as any,
    paddingBottom: 'env(safe-area-inset-bottom, 10px)' as any,
  },
  link: { flex: 1, textDecorationLine: 'none' },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  label: { fontSize: 11, fontWeight: '600', color: C.inactive },
  labelActive: { color: C.active },
});
