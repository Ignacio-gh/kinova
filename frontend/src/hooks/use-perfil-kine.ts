import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { api, clearToken } from '@/services/api';

interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

interface KineProfile {
  matricula: string;
  especialidad: string | null;
}

export interface KineStats {
  active_patients: number;
  total_sessions: number;
  avg_adherence: number;
}

// Sección de ajustes estática (no depende de datos del usuario)
export const PERFIL_AJUSTES = [
  { icon: 'notifications-outline' as const, label: 'Notificaciones' },
  { icon: 'lock-closed-outline' as const, label: 'Privacidad y seguridad' },
  { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte' },
];

export function usePerfilKine() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [kineProfile, setKineProfile] = useState<KineProfile | null>(null);
  const [kineStats, setKineStats] = useState<KineStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<UserResponse & { kinesiologo_profile: KineProfile | null }>('/api/v1/auth/me'),
      api.get<KineStats>('/api/v1/sessions/kine/stats'),
    ])
      .then(([me, stats]) => {
        setUser(me);
        setKineProfile(me.kinesiologo_profile);
        setKineStats(stats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await clearToken();
    router.replace('/');
  };

  const perfilInfo = [
    { icon: 'person-outline' as const, label: 'Nombre completo', value: user?.full_name ?? '...' },
    { icon: 'mail-outline' as const, label: 'Correo', value: user?.email ?? '...' },
    { icon: 'medical-outline' as const, label: 'Especialidad', value: kineProfile?.especialidad ?? 'Kinesiología' },
    { icon: 'id-card-outline' as const, label: 'Matrícula', value: kineProfile?.matricula ?? '...' },
  ];

  return { perfilInfo, loading, handleLogout, kineStats };
}
