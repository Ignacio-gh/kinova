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

export function usePerfilKine() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [kineProfile, setKineProfile] = useState<KineProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<UserResponse & { kinesiologo_profile: KineProfile | null }>('/api/v1/auth/me')
      .then((data) => {
        setUser(data);
        setKineProfile(data.kinesiologo_profile);
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

  return { perfilInfo, loading, handleLogout };
}
