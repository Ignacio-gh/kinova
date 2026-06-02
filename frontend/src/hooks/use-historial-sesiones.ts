import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export interface SessionExercise {
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
}

export interface SessionHistoryItem {
  id: number;
  date: string; // ISO datetime string
  duration_minutes: number | null;
  adherence_pct: number | null;
  exercises: SessionExercise[];
}

export interface HistorialStats {
  total_sessions: number;
  avg_adherence: number;
  total_minutes: number;
  exercises_completed: number;
}

export function useHistorialSesiones() {
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [stats, setStats] = useState<HistorialStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<SessionHistoryItem[]>('/api/v1/sessions/me/history'),
      api.get<HistorialStats>('/api/v1/sessions/me/stats'),
    ])
      .then(([history, dashboardStats]) => {
        setSessions(history);
        setStats(dashboardStats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { sessions, stats, loading };
}

export function formatSessionDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
