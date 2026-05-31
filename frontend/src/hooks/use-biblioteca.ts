import { useState } from 'react';
import type { Exercise } from '@/components/kinesiologo/exercise-card';

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Sentadilla',
    category: 'Muslo',
    muscles: ['Cuádriceps', 'Glúteo mayor', 'Isquiotibiales', 'Core'],
    description:
      'Patrón de movimiento básico y poliarticular para desarrollar fuerza global en todo el miembro inferior.',
    benefits: ['Aumenta densidad ósea', 'Fortalece cadena cinética anterior', 'Funcionalidad diaria'],
  },
  {
    id: '2',
    name: 'Extensión Sentado',
    category: 'Rodilla',
    muscles: ['Cuádriceps femoral'],
    description:
      'Ejercicio cinético abierto ideal para el aislamiento muscular y control analítico de la extensión terminal de rodilla.',
    benefits: ['Aísla el vasto medial', 'Estabiliza la rótula', 'Seguro para fases tempranas'],
  },
  {
    id: '3',
    name: 'Elevación de pierna recta',
    category: 'Cadera',
    muscles: ['Cuádriceps', 'Psoas ilíaco'],
    description:
      'Ejercicio de activación muscular isométrico y concéntrico sin carga articular sobre la rodilla.',
    benefits: ['Evita inhibición del cuádriceps', 'Cero compresión patelar', 'Fortalece flexores'],
  },
  {
    id: '4',
    name: 'Elevación de Talón',
    category: 'Tobillo',
    muscles: ['Gastrocnemio', 'Sóleo'],
    description:
      'Ejercicio de cadena cinética cerrada para fortalecer la musculatura plantiflexora del tobillo.',
    benefits: ['Mejora propiocepción', 'Previene esguinces', 'Fortalece arco plantar'],
  },
  {
    id: '5',
    name: 'Sentadilla Búlgara',
    category: 'Muslo',
    muscles: ['Cuádriceps', 'Glúteo mayor', 'Core'],
    description:
      'Variante unilateral de sentadilla que permite mayor rango de movimiento y trabajo asimétrico de miembros inferiores.',
    benefits: ['Corrige desequilibrios musculares', 'Mayor activación de glúteo', 'Mejora el equilibrio'],
  },
];

export type CategoryFilter = 'Todos' | 'Cadera' | 'Rodilla' | 'Muslo' | 'Tobillo';
export const CATEGORY_FILTERS: CategoryFilter[] = ['Todos', 'Cadera', 'Rodilla', 'Muslo', 'Tobillo'];

export function useBiblioteca() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('Todos');

  const filtered = MOCK_EXERCISES.filter((e) => {
    const matchCat = filter === 'Todos' || e.category === filter;
    const q = search.toLowerCase();
    const matchSearch =
      e.name.toLowerCase().includes(q) ||
      e.muscles.some((m) => m.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return { search, setSearch, filter, setFilter, filtered };
}
