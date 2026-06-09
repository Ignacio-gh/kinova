import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { Exercise } from '@/components/kinesiologo/exercise-card';

interface ExerciseResponse {
  id: number;
  name: string;
  zone: string;
  description: string | null;
  steps: string[];
  benefits: string[];
  target_muscles: string[];
  image_url: string | null;
  video_url: string | null;
  evaluator_key: string | null;
}

function mapExercise(e: ExerciseResponse): Exercise {
  return {
    id: String(e.id),
    name: e.name,
    category: e.zone,
    muscles: e.target_muscles,
    description: e.description ?? '',
    benefits: e.benefits,
  };
}

export type CategoryFilter = 'Todos' | 'Cadera' | 'Rodilla' | 'Muslo' | 'Tobillo' | 'Glúteo';
export const CATEGORY_FILTERS: CategoryFilter[] = ['Todos', 'Cadera', 'Rodilla', 'Muslo', 'Tobillo', 'Glúteo'];

export function useBiblioteca() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('Todos');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ExerciseResponse[]>('/api/v1/exercises')
      .then((data) => setExercises(data.map(mapExercise)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = exercises.filter((e) => {
    const matchCat = filter === 'Todos' || e.category === filter;
    const q = search.toLowerCase();
    const matchSearch =
      e.name.toLowerCase().includes(q) ||
      e.muscles.some((m) => m.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return { search, setSearch, filter, setFilter, filtered, loading };
}
