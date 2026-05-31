import { useState } from 'react';
import { useRouter } from 'expo-router';
import type { Patient } from '@/components/kinesiologo/patient-card';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    diagnosis: 'Lesión de rodilla izquierda',
    lastSession: 'Última sesión: 11/5/2026',
    email: 'carlos@email.com',
    adherence: 85,
    status: 'Activo',
    weeklyProgress: 71,
    pendingReview: true,
  },
  {
    id: '2',
    name: 'María González',
    diagnosis: 'Rehabilitación de tobillo',
    lastSession: 'Última sesión: 10/5/2026',
    email: 'maria@email.com',
    adherence: 92,
    status: 'Activo',
    weeklyProgress: 85,
    pendingReview: false,
  },
  {
    id: '3',
    name: 'Juan Pérez',
    diagnosis: 'Fortalecimiento de cuádriceps',
    lastSession: 'Última sesión: 27/4/2026',
    email: 'juan@email.com',
    adherence: 100,
    status: 'Finalizado',
    weeklyProgress: 100,
    pendingReview: false,
  },
];

export type Filter = 'Todos' | 'Activo' | 'Finalizado';
export const FILTERS: Filter[] = ['Todos', 'Activo', 'Finalizado'];
export const FILTER_LABELS: Record<Filter, string> = {
  Todos: 'Todos',
  Activo: 'Activos',
  Finalizado: 'Finalizados',
};

export function useMisPacientes() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('Todos');

  const filtered = MOCK_PATIENTS.filter((p) => {
    const matchFilter = filter === 'Todos' || p.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const goToPatient = (id: string) =>
    router.push(`/kinesiologo/paciente/${id}` as never);

  return { search, setSearch, filter, setFilter, filtered, goToPatient };
}
