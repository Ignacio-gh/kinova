import { useRouter } from 'expo-router';

export const PERFIL_INFO = [
  { icon: 'person-outline' as const, label: 'Nombre completo', value: 'Dr. Rodríguez' },
  { icon: 'mail-outline' as const, label: 'Correo', value: 'kinesiologo@kinova.com' },
  { icon: 'medical-outline' as const, label: 'Especialidad', value: 'Kinesiología' },
  { icon: 'id-card-outline' as const, label: 'Matrícula', value: 'KIN-4821' },
];

export const PERFIL_AJUSTES = [
  { icon: 'notifications-outline' as const, label: 'Notificaciones' },
  { icon: 'lock-closed-outline' as const, label: 'Cambiar contraseña' },
  { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte' },
];

export function usePerfilKine() {
  const router = useRouter();
  const handleLogout = () => router.replace('/');
  return { handleLogout };
}
