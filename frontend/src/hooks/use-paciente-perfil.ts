import { useEffect, useState } from 'react';
import { api, clearToken } from '@/services/api';
import { useRouter } from 'expo-router';

interface PatientSelfProfile {
  full_name: string;
  email: string;
  diagnosis: string;
  treatment_weeks: number;
  current_week: number;
  status: string;
  kinesiologo_name: string | null;
}

export function usePacientePerfil() {
  const router = useRouter();
  const [profile, setProfile] = useState<PatientSelfProfile | null>(null);

  useEffect(() => {
    api.get<PatientSelfProfile>('/api/v1/patients/me/profile')
      .then(setProfile)
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    await clearToken();
    router.replace('/');
  };

  return { profile, handleLogout };
}
