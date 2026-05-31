import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconProps = { color: string; size: number };

export default function KinesiologoTabsLayout() {
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
          height: 62,
          paddingBottom: 10,
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
          title: 'Pacientes',
          tabBarIcon: ({ color, size }: IconProps) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="biblioteca"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color, size }: IconProps) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
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
