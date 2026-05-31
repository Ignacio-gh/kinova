import { useState } from 'react';
import { useRouter } from 'expo-router';

export type TodayExercise = {
  id: string;
  name: string;
  muscle: string;
  reps: number;
  series: number;
  completed: boolean;
};

export type UpcomingExercise = {
  id: string;
  name: string;
  day: string;
  muscle: string;
  series: number;
  reps: number;
};

const INITIAL_TODAY: TodayExercise[] = [
  { id: 't1', name: 'Sentadilla', muscle: 'Muslo', reps: 20, series: 3, completed: true },
  { id: 't2', name: 'Extensión Sentado', muscle: 'Rodilla', reps: 15, series: 3, completed: false },
  { id: 't3', name: 'Elevación pierna recta', muscle: 'Cadera', reps: 25, series: 4, completed: false },
];

export const UPCOMING: UpcomingExercise[] = [
  { id: 'u1', name: 'Elevación de Talón', day: 'Martes', muscle: 'Tobillo', series: 3, reps: 30 },
  { id: 'u2', name: 'Flexión de Cadera', day: 'Martes', muscle: 'Muslo', series: 3, reps: 12 },
  { id: 'u3', name: 'Zancada Frontal', day: 'Miércoles', muscle: 'Muslo', series: 3, reps: 15 },
];

const TOTAL_WEEKLY = 7;
const COMPLETED_WEEKLY = 4;

export function usePacienteInicio() {
  const router = useRouter();
  const [exercises, setExercises] = useState<TodayExercise[]>(INITIAL_TODAY);

  const completedToday = exercises.filter((e) => e.completed).length;
  const weeklyPercent = Math.round((COMPLETED_WEEKLY / TOTAL_WEEKLY) * 100);
  const totalWeekly = TOTAL_WEEKLY;
  const completedWeekly = COMPLETED_WEEKLY;

  const today = new Date()
    .toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .replace(/^\w/, (c) => c.toUpperCase());

  const toggleExercise = (id: string) =>
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );

  const goToCalendar = () => router.navigate('/paciente/calendario' as never);

  return {
    exercises,
    completedToday,
    weeklyPercent,
    totalWeekly,
    completedWeekly,
    today,
    toggleExercise,
    goToCalendar,
  };
}
