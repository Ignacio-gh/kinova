import { useEffect, useState } from 'react';
import { api } from '@/services/api';

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

const DAY_MAP: Record<string, Day> = {
  monday: 'Lun', tuesday: 'Mar', wednesday: 'Mié',
  thursday: 'Jue', friday: 'Vie', saturday: 'Sáb', sunday: 'Dom',
};

interface RoutineItem {
  id: number;
  exercise: { id: number; name: string; zone: string };
  day_of_week: string;
  reps: number;
  sets: number;
  angle_min: number | null;
  angle_max: number | null;
}

interface WeeklyResponse {
  monday: RoutineItem[];
  tuesday: RoutineItem[];
  wednesday: RoutineItem[];
  thursday: RoutineItem[];
  friday: RoutineItem[];
  saturday: RoutineItem[];
  sunday: RoutineItem[];
}

function buildAngle(min: number | null, max: number | null): string | undefined {
  if (min != null && max != null) return `${min}° - ${max}°`;
  return undefined;
}

export function useMiCalendario() {
  const [selectedDay, setSelectedDay] = useState<Day>('Lun');
  const [routine, setRoutine] = useState<Record<Day, CalendarExercise[]>>(
    Object.fromEntries(DAYS.map((d) => [d, []])) as Record<Day, CalendarExercise[]>
  );
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<WeeklyResponse>('/api/v1/routines/me/week')
      .then((data) => {
        const mapped = Object.fromEntries(DAYS.map((d) => [d, []])) as Record<Day, CalendarExercise[]>;
        for (const [backendDay, items] of Object.entries(data)) {
          const day = DAY_MAP[backendDay];
          if (!day) continue;
          mapped[day] = items.map((r) => ({
            id: String(r.id),
            name: r.exercise.name,
            series: r.sets,
            reps: r.reps,
            angle: buildAngle(r.angle_min, r.angle_max),
            muscle: r.exercise.zone,
          }));
        }
        setRoutine(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dayExercises = routine[selectedDay] ?? [];

  const toggleComplete = (id: string) =>
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return { selectedDay, setSelectedDay, completedIds, dayExercises, routine, loading, toggleComplete };
}
