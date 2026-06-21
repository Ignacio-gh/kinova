import { useWindowDimensions } from 'react-native';
import { Tabs, Slot } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconProps = { color: string; size: number };

export default function PacienteTabsLayoutWeb() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (isMobile) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#00A896',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            height: 'calc(62px + env(safe-area-inset-bottom, 0px))' as any,
            paddingBottom: 'env(safe-area-inset-bottom, 10px)' as any,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }: IconProps) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendario"
          options={{
            title: 'Mi Calendario',
            tabBarIcon: ({ color, size }: IconProps) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="historial"
          options={{
            title: 'Historial',
            tabBarIcon: ({ color, size }: IconProps) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Mi Perfil',
            tabBarIcon: ({ color, size }: IconProps) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    );
  }

  return <Slot />;
}
