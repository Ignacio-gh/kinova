import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

export type TodayExercise = {
  id: string;
  name: string;
  muscle: string;
  evaluatorKey: string | null;
  reps: number;
  series: number;
  completed: boolean;
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
  }[];
  adherence_pct: number;
  current_week: number;
  treatment_weeks: number;
}

interface UserResponse {
  full_name: string;
  email: string;
}

export function usePacienteInicio() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [exercises, setExercises] = useState<TodayExercise[]>([]);
  const [adherencePct, setAdherencePct] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [treatmentWeeks, setTreatmentWeeks] = useState(1);
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
            completed: false,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completedToday = exercises.filter((e) => e.completed).length;
  const weeklyPercent = Math.round(adherencePct);

  const today = new Date()
    .toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
    .replace(/^\w/, (c) => c.toUpperCase());

  const toggleExercise = (id: string) =>
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );

  const goToCalendar = () => router.navigate('/paciente/calendario' as never);

  return {
    userName,
    exercises,
    completedToday,
    weeklyPercent,
    totalWeekly: treatmentWeeks,
    completedWeekly: currentWeek,
    today,
    loading,
    toggleExercise,
    goToCalendar,
  };
}
