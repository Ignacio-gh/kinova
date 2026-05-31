import { useRouter } from 'expo-router';

export function useWelcome() {
  const router = useRouter();

  const goToPatient = () => router.push('/paciente/login');
  const goToKinesiologo = () => router.push('/kinesiologo/login');

  const stats = [
    { value: '98%', label: 'Precisión\nen análisis' },
    { value: '24/7', label: 'Disponibilidad' },
    { value: '1000+', label: 'Pacientes\nactivos' },
  ] as const;

  return { goToPatient, goToKinesiologo, stats };
}
