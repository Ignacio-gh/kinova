import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { Patient } from '@/components/kinesiologo/patient-card';

interface PatientListItem {
  id: number;
  full_name: string;
  email: string;
  diagnosis: string;
  status: string;
  current_week: number;
  treatment_weeks: number;
  adherence_pct: number | null;
  last_session_at: string | null;
}

function mapPatient(p: PatientListItem): Patient {
  const lastSession = p.last_session_at
    ? `Última sesión: ${new Date(p.last_session_at).toLocaleDateString('es-AR')}`
    : 'Sin sesiones aún';
  return {
    id: String(p.id),
    name: p.full_name,
    email: p.email,
    diagnosis: p.diagnosis,
    status: p.status === 'activo' ? 'Activo' : 'Finalizado',
    adherence: Math.round(p.adherence_pct ?? 0),
    // Progreso del tratamiento (semana actual / semanas totales) — distinto
    // de la adherencia, que mide cumplimiento semanal, no avance del plan.
    weeklyProgress: p.treatment_weeks > 0
      ? Math.round(Math.min((p.current_week / p.treatment_weeks) * 100, 100))
      : 0,
    lastSession,
    pendingReview: false,
  };
}

interface PatientsContextValue {
  patients: Patient[];
  loading: boolean;
  refetch: () => void;
}

const PatientsContext = createContext<PatientsContextValue>({
  patients: [],
  loading: true,
  refetch: () => {},
});

export function PatientsProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    api.get<PatientListItem[]>('/api/v1/patients')
      .then((data) => setPatients(data.map(mapPatient)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return (
    <PatientsContext.Provider value={{ patients, loading, refetch }}>
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatientsContext() {
  return useContext(PatientsContext);
}
