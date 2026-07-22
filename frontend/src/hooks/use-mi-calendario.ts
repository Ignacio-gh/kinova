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

// Date.getDay(): 0 = domingo … 6 = sábado
const JS_DAY_TO_LABEL: Day[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const TODAY: Day = JS_DAY_TO_LABEL[new Date().getDay()];

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

interface DashboardResponse {
  today_exercises: { routine_id: number; completed: boolean }[];
}

function buildAngle(min: number | null, max: number | null): string | undefined {
  if (min != null && max != null) return `${min}° - ${max}°`;
  return undefined;
}

export function useMiCalendario() {
  const [selectedDay, setSelectedDay] = useState<Day>(TODAY);
  const [routine, setRoutine] = useState<Record<Day, CalendarExercise[]>>(
    Object.fromEntries(DAYS.map((d) => [d, []])) as Record<Day, CalendarExercise[]>
  );
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<WeeklyResponse>('/api/v1/routines/me/week'),
      api.get<DashboardResponse>('/api/v1/patients/me/dashboard'),
    ])
      .then(([data, dashboard]) => {
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
        // El backend solo sabe si se completó HOY — no hay estado real para
        // otros días de la semana, así que el Set solo refleja el día actual.
        setCompletedIds(
          new Set(
            dashboard.today_exercises.filter((e) => e.completed).map((e) => String(e.routine_id)),
          ),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dayExercises = routine[selectedDay] ?? [];

  const toggleComplete = async (id: string) => {
    // Solo se puede marcar como completado el día de hoy — el endpoint no
    // acepta una fecha arbitraria, siempre usa "ahora".
    if (selectedDay !== TODAY || completedIds.has(id)) return;

    setCompletedIds((prev) => new Set(prev).add(id));

    const exercise = dayExercises.find((e) => e.id === id);
    try {
      await api.post('/api/v1/sessions/complete-exercise', {
        routine_id: parseInt(id),
        completed_reps: (exercise?.reps ?? 0) * (exercise?.series ?? 1),
        correct_reps: (exercise?.reps ?? 0) * (exercise?.series ?? 1),
        avg_score: 100.0,
      });
    } catch (error) {
      console.error('Error al completar ejercicio:', error);
    }
  };

  return { selectedDay, setSelectedDay, completedIds, dayExercises, routine, loading, toggleComplete, today: TODAY };
}
