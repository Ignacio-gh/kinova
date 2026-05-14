import { useState } from 'react';
import { CheckCircle, XCircle, Play } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Exercise {
  id: number;
  name: string;
  zone: string;
  reps: number;
  sets: number;
  minAngle?: number;
  maxAngle?: number;
  completed: boolean;
  hasVideo: boolean;
}

interface DayExercises {
  [key: string]: Exercise[];
}

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const mockExercises: DayExercises = {
  'Lunes': [
    { id: 1, name: 'Sentadilla Búlgara', zone: 'Muslo', reps: 20, sets: 3, minAngle: 60, maxAngle: 90, completed: true, hasVideo: true },
    { id: 2, name: 'Extensión de Rodilla', zone: 'Rodilla', reps: 15, sets: 3, completed: true, hasVideo: true },
  ],
  'Martes': [
    { id: 3, name: 'Elevación de Talón', zone: 'Tobillo', reps: 30, sets: 3, completed: false, hasVideo: true },
  ],
  'Miércoles': [
    { id: 4, name: 'Puente de Glúteo', zone: 'Glúteo', reps: 25, sets: 4, completed: false, hasVideo: true },
  ],
  'Jueves': [],
  'Viernes': [
    { id: 5, name: 'Zancada Frontal', zone: 'Muslo', reps: 15, sets: 3, minAngle: 70, maxAngle: 110, completed: false, hasVideo: true },
  ],
  'Sábado': [],
  'Domingo': []
};

export function PatientCalendar() {
  const { colors } = useTheme();
  const [exercises, setExercises] = useState<DayExercises>(mockExercises);

  const toggleCompleted = (day: string, exerciseId: number) => {
    setExercises(prev => ({
      ...prev,
      [day]: prev[day].map(ex =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )
    }));
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl mb-2 font-bold" style={{ color: colors.primaryText }}>
          Mi Calendario Semanal
        </h2>
        <p className="text-lg" style={{ color: colors.secondaryText }}>
          Visualiza y completa tus ejercicios asignados
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Ejercicios Esta Semana</p>
            <p className="text-3xl font-bold" style={{ color: colors.primaryText }}>
              {Object.values(exercises).flat().length}
            </p>
          </div>

          <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Completados</p>
            <p className="text-3xl font-bold" style={{ color: '#28A745' }}>
              {Object.values(exercises).flat().filter(e => e.completed).length}
            </p>
          </div>

          <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Tu Adherencia</p>
            <p className="text-3xl font-bold" style={{ color: '#00A896' }}>
              {Object.values(exercises).flat().length > 0
                ? Math.round((Object.values(exercises).flat().filter(e => e.completed).length / Object.values(exercises).flat().length) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: colors.border }}>
        {/* Table Header */}
        <div className="grid grid-cols-7 border-b" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold border-r last:border-r-0"
              style={{ color: colors.primaryText, borderColor: colors.border }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="grid grid-cols-7">
          {daysOfWeek.map((day) => {
            const dayExercises = exercises[day] || [];

            return (
              <div
                key={day}
                className="border-r last:border-r-0 p-4 min-h-[350px]"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface
                }}
              >
                {dayExercises.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-center" style={{ color: colors.secondaryText }}>
                      Sin ejercicios
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="rounded-xl p-3 border"
                        style={{
                          backgroundColor: colors.cardBg,
                          borderColor: colors.border
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm" style={{ color: colors.primaryText }}>
                            {exercise.name}
                          </h4>
                          {exercise.completed ? (
                            <CheckCircle size={16} style={{ color: '#28A745' }} className="flex-shrink-0" />
                          ) : (
                            <XCircle size={16} style={{ color: '#9ca3af' }} className="flex-shrink-0" />
                          )}
                        </div>

                        <p className="text-xs mb-2" style={{ color: colors.secondaryText }}>
                          {exercise.sets} series × {exercise.reps} reps
                        </p>

                        {(exercise.minAngle || exercise.maxAngle) && (
                          <p className="text-xs mb-2" style={{ color: '#00A896' }}>
                            Ángulo: {exercise.minAngle}° - {exercise.maxAngle}°
                          </p>
                        )}

                        <div className="text-xs mb-3">
                          <span className="px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: '#00A896' }}>
                            {exercise.zone}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {exercise.hasVideo && (
                            <button
                              className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg transition-colors text-xs font-medium"
                              style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: '#00A896' }}
                              title="Ver video demo"
                            >
                              <Play size={12} />
                              Video
                            </button>
                          )}
                          <button
                            onClick={() => toggleCompleted(day, exercise.id)}
                            className="flex-1 p-2 rounded-lg transition-colors text-xs font-medium"
                            style={{
                              backgroundColor: exercise.completed ? 'rgba(40, 167, 69, 0.1)' : 'rgba(0, 168, 150, 0.1)',
                              color: exercise.completed ? '#28A745' : '#00A896'
                            }}
                          >
                            {exercise.completed ? 'Completado' : 'Marcar'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
