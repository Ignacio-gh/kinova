import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Session {
  id: number;
  date: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    completed: boolean;
  }[];
  duration: number;
  adherence: number;
}

const mockSessions: Session[] = [
  {
    id: 1,
    date: '2026-05-12',
    exercises: [
      { name: 'Sentadilla Búlgara', sets: 3, reps: 20, completed: true },
      { name: 'Extensión de Rodilla', sets: 3, reps: 15, completed: true },
    ],
    duration: 25,
    adherence: 100
  },
  {
    id: 2,
    date: '2026-05-11',
    exercises: [
      { name: 'Elevación de Talón', sets: 3, reps: 30, completed: true },
    ],
    duration: 15,
    adherence: 100
  },
  {
    id: 3,
    date: '2026-05-09',
    exercises: [
      { name: 'Sentadilla Búlgara', sets: 3, reps: 20, completed: true },
      { name: 'Extensión de Rodilla', sets: 3, reps: 15, completed: false },
    ],
    duration: 18,
    adherence: 50
  },
  {
    id: 4,
    date: '2026-05-08',
    exercises: [
      { name: 'Puente de Glúteo', sets: 4, reps: 25, completed: true },
      { name: 'Zancada Frontal', sets: 3, reps: 15, completed: true },
    ],
    duration: 22,
    adherence: 100
  },
  {
    id: 5,
    date: '2026-05-06',
    exercises: [
      { name: 'Sentadilla Búlgara', sets: 3, reps: 20, completed: true },
      { name: 'Extensión de Rodilla', sets: 3, reps: 15, completed: true },
      { name: 'Elevación de Talón', sets: 3, reps: 30, completed: true },
    ],
    duration: 35,
    adherence: 100
  },
];

export function SessionHistory() {
  const { colors } = useTheme();

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl mb-2 font-bold" style={{ color: colors.primaryText }}>
          Historial de Sesiones
        </h2>
        <p className="text-lg" style={{ color: colors.secondaryText }}>
          Revisa tus sesiones completadas y tu progreso
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Total de Sesiones</p>
            <p className="text-3xl font-bold" style={{ color: colors.primaryText }}>
              {mockSessions.length}
            </p>
          </div>

          <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Adherencia Promedio</p>
            <p className="text-3xl font-bold" style={{ color: '#28A745' }}>
              {Math.round(mockSessions.reduce((acc, s) => acc + s.adherence, 0) / mockSessions.length)}%
            </p>
          </div>

          <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Tiempo Total</p>
            <p className="text-3xl font-bold" style={{ color: '#00A896' }}>
              {mockSessions.reduce((acc, s) => acc + s.duration, 0)} min
            </p>
          </div>

          <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Ejercicios Completados</p>
            <p className="text-3xl font-bold" style={{ color: colors.primaryText }}>
              {mockSessions.reduce((acc, s) => acc + s.exercises.filter(e => e.completed).length, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-4">
        {mockSessions.map((session) => (
          <div
            key={session.id}
            className="rounded-2xl p-6 border"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
                >
                  <Calendar size={24} style={{ color: '#00A896' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: colors.primaryText }}>
                    {new Date(session.date).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="flex items-center gap-4 text-sm" style={{ color: colors.secondaryText }}>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {session.duration} minutos
                    </span>
                    <span>•</span>
                    <span>{session.exercises.length} ejercicios</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm mb-1" style={{ color: colors.secondaryText }}>
                  Adherencia
                </p>
                <p className="text-2xl font-bold" style={{ color: session.adherence >= 80 ? '#28A745' : '#FFC107' }}>
                  {session.adherence}%
                </p>
              </div>
            </div>

            {/* Exercise List */}
            <div className="grid grid-cols-2 gap-3">
              {session.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold" style={{ color: colors.primaryText }}>
                      {exercise.name}
                    </h4>
                    {exercise.completed ? (
                      <CheckCircle size={18} style={{ color: '#28A745' }} />
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full border-2"
                        style={{ borderColor: colors.secondaryText }}
                      />
                    )}
                  </div>
                  <p className="text-sm" style={{ color: colors.secondaryText }}>
                    {exercise.sets} series × {exercise.reps} reps
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
