import { useState } from 'react';

export type CalendarExercise = {
  id: string;
  name: string;
  series: number;
  reps: number;
  angle?: string;
  muscle: string;
};

export const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;
export type Day = (typeof DAYS)[number];

export const ROUTINE: Record<Day, CalendarExercise[]> = {
  Lun: [
    { id: 'e1', name: 'Sentadilla Búlgara', series: 3, reps: 20, angle: '60° - 90°', muscle: 'Muslo' },
    { id: 'e2', name: 'Extensión de Rodilla', series: 3, reps: 15, muscle: 'Rodilla' },
  ],
  Mar: [
    { id: 'e3', name: 'Sentadilla', series: 3, reps: 20, angle: '60° - 90°', muscle: 'Muslo' },
    { id: 'e4', name: 'Extensión Sentado', series: 3, reps: 15, muscle: 'Rodilla' },
    { id: 'e5', name: 'Elevación de pierna recta', series: 4, reps: 25, angle: '60° - 90°', muscle: 'Cadera' },
  ],
  Mié: [{ id: 'e6', name: 'Puente de Glúteo', series: 4, reps: 25, muscle: 'Glúteo' }],
  Jue: [],
  Vie: [{ id: 'e7', name: 'Zancada Frontal', series: 3, reps: 15, angle: '70° - 110°', muscle: 'Muslo' }],
  Sáb: [],
  Dom: [],
};

const PRE_COMPLETED = new Set<string>(['e1', 'e2']);

export function useMiCalendario() {
  const [selectedDay, setSelectedDay] = useState<Day>('Lun');
  const [completedIds, setCompletedIds] = useState<Set<string>>(PRE_COMPLETED);

  const dayExercises = ROUTINE[selectedDay] ?? [];

  const toggleComplete = (id: string) =>
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return { selectedDay, setSelectedDay, completedIds, dayExercises, toggleComplete };
}
