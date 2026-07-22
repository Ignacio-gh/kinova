import { useState } from 'react';
import { useRouter } from 'expo-router';
import { usePatientsContext } from '@/context/PatientsContext';
import type { Patient } from '@/components/kinesiologo/patient-card';

export type Filter = 'Todos' | 'Activo' | 'Finalizado';
export const FILTERS: Filter[] = ['Todos', 'Activo', 'Finalizado'];
export const FILTER_LABELS: Record<Filter, string> = {
  Todos: 'Todos',
  Activo: 'Activos',
  Finalizado: 'Dados de alta',
};

export function useMisPacientes() {
  const router = useRouter();
  const { patients, loading, refetch } = usePatientsContext();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('Todos');

  const filtered = patients.filter((p: Patient) => {
    const matchFilter = filter === 'Todos' || p.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const goToPatient = (id: string) =>
    router.push(`/kinesiologo/paciente/${id}` as never);

  return { search, setSearch, filter, setFilter, filtered, loading, goToPatient, refetch };
}
