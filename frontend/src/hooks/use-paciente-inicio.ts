import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

// Mientras no haya endpoint de "próximos ejercicios" exportamos un array vacío
// para que el componente que lo consume no rompa con "map of undefined".
export type UpcomingExercise = {
  id: string;
  name: string;
  muscle: string;
  day: string;
  reps: number;
  series: number;
};
export const UPCOMING: UpcomingExercise[] = [];

export type TodayExercise = {
  id: string;
  name: string;
  muscle: string;
  evaluatorKey: string | null;
  reps: number;
  series: number;
  completed: boolean;
  angleMin: number | null;
  angleMax: number | null;
};

interface DashboardResponse {
  today_exercises: {
    routine_id: number;
    name: string;
    zone: string;
    evaluator_key: string | null;
    reps: number;
    sets: number;
    effective_angle_min: number | null;
    effective_angle_max: number | null;
    completed: boolean;
  }[];
  adherence_pct: number;
  current_week: number;
  treatment_weeks: number;
}

interface UserResponse {
  full_name: string;
  email: string;
}

interface RoutineWeekResponse {
  monday: unknown[];
  tuesday: unknown[];
  wednesday: unknown[];
  thursday: unknown[];
  friday: unknown[];
  saturday: unknown[];
  sunday: unknown[];
}

interface HistorySessionResponse {
  date: string;
  exercises: { completed: boolean }[];
}

// Lunes 00:00 de la semana actual, para filtrar el historial.
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = domingo … 6 = sábado
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function usePacienteInicio() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [exercises, setExercises] = useState<TodayExercise[]>([]);
  const [adherencePct, setAdherencePct] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [treatmentWeeks, setTreatmentWeeks] = useState(1);
  const [totalWeekly, setTotalWeekly] = useState(0);
  const [completedWeekly, setCompletedWeekly] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamadas separadas para que un fallo no bloquee la otra
    api.get<UserResponse>('/api/v1/auth/me')
      .then((user) => setUserName(user.full_name.split(' ')[0]))
      .catch(console.error);

    api.get<DashboardResponse>('/api/v1/patients/me/dashboard')
      .then((dashboard) => {
        setAdherencePct(dashboard.adherence_pct);
        setCurrentWeek(dashboard.current_week);
        setTreatmentWeeks(dashboard.treatment_weeks);
        setExercises(
          dashboard.today_exercises.map((e) => ({
            id: String(e.routine_id),
            name: e.name,
            muscle: e.zone,
            evaluatorKey: e.evaluator_key,
            reps: e.reps,
            series: e.sets,
            completed: e.completed ?? false,
            angleMin: e.effective_angle_min ?? null,
            angleMax: e.effective_angle_max ?? null,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Progreso semanal real: total asignado en toda la semana vs.
    // completados desde el lunes — no solo lo de hoy.
    api.get<RoutineWeekResponse>('/api/v1/routines/me/week')
      .then((week) => {
        const total = Object.values(week).reduce((sum, items) => sum + items.length, 0);
        setTotalWeekly(total);
      })
      .catch(console.error);

    api.get<HistorySessionResponse[]>('/api/v1/sessions/me/history')
      .then((history) => {
        const weekStart = getWeekStart();
        const completed = history
          .filter((s) => new Date(s.date) >= weekStart)
          .reduce((sum, s) => sum + s.exercises.filter((e) => e.completed).length, 0);
        setCompletedWeekly(completed);
      })
      .catch(console.error);
  }, []);

  const completedToday = exercises.filter((e) => e.completed).length;
  const totalToday = exercises.length;
  const weeklyPercent = totalToday > 0
    ? Math.round((completedToday / totalToday) * 100)
    : 0;

  const today = new Date()
    .toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
    .replace(/^\w/, (c) => c.toUpperCase());

  const toggleExercise = async (id: string) => {
    const exercise = exercises.find((e) => e.id === id);
    if (!exercise || exercise.completed) return;

    // Optimistic update: la UI responde de inmediato sin esperar al backend
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: true } : e))
    );
    setCompletedWeekly((prev) => prev + 1);

    try {
      await api.post('/api/v1/sessions/complete-exercise', {
        routine_id: parseInt(id),
        completed_reps: exercise.reps * exercise.series,
        correct_reps: exercise.reps * exercise.series,
        avg_score: 100.0,
      });

      // Refrescar adherencia desde el backend tras confirmar el guardado
      api.get<DashboardResponse>('/api/v1/patients/me/dashboard')
        .then((dashboard) => {
          setAdherencePct(dashboard.adherence_pct);
          // Sincronizar estado completado con la respuesta del servidor
          setExercises((prev) =>
            prev.map((e) => {
              const match = dashboard.today_exercises.find(
                (be) => String(be.routine_id) === e.id,
              );
              return match ? { ...e, completed: match.completed } : e;
            })
          );
        })
        .catch(console.error);
    } catch (error) {
      console.error('Error al completar ejercicio:', error);
      // El optimistic update ya está aplicado; no revertir para no confundir al usuario
    }
  };

  const goToCalendar = () => router.navigate('/paciente/calendario' as never);

  return {
    userName,
    exercises,
    completedToday,
    weeklyPercent,
    adherencePct,
    totalWeekly,
    completedWeekly,
    today,
    loading,
    toggleExercise,
    goToCalendar,
  };
}
