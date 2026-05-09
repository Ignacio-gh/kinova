import { Trash2, Pencil, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const exercises = [
  { id: 1, name: 'Sentadilla Búlgara', reps: '20', sets: '3', day: 'Lunes', zone: 'Muslo' },
  { id: 2, name: 'Extensión de Rodilla', reps: '15', sets: '3', day: 'Lunes', zone: 'Rodilla' },
  { id: 3, name: 'Puente de Glúteo', reps: '25', sets: '4', day: 'Lunes', zone: 'Glúteo' },
  { id: 4, name: 'Elevación de Talón', reps: '30', sets: '3', day: 'Martes', zone: 'Tobillo' },
  { id: 5, name: 'Flexión de Cadera', reps: '12', sets: '3', day: 'Martes', zone: 'Muslo' },
  { id: 6, name: 'Zancada Frontal', reps: '15', sets: '3', day: 'Miércoles', zone: 'Muslo' },
  { id: 7, name: 'Flexión de Rodilla', reps: '20', sets: '3', day: 'Jueves', zone: 'Rodilla' },
  { id: 8, name: 'Abducción de Cadera', reps: '15', sets: '4', day: 'Viernes', zone: 'Glúteo' },
];

export function MiRutina() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const getExercisesForDay = (day: string) => {
    return exercises.filter((ex) => ex.day === day);
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl mb-2" style={{ color: colors.primaryText, fontWeight: '700' }}>
            Mi Rutina Semanal
          </h2>
          <p className="text-lg" style={{ color: colors.secondaryText }}>
            Planificación de ejercicios para rehabilitación de piernas
          </p>
        </div>
        <button
          onClick={() => navigate('/ejercicios')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:shadow-lg font-semibold"
          style={{ backgroundColor: '#00A896', color: '#ffffff' }}
        >
          <Plus size={20} />
          Añadir Ejercicio
        </button>
      </div>

      {/* Weekly Grid Calendar */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: colors.border }}
      >
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
            const dayExercises = getExercisesForDay(day);

            return (
              <div
                key={day}
                className="border-r last:border-r-0 p-4 min-h-[300px]"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface
                }}
              >
                <div className="space-y-3">
                  {dayExercises.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: colors.secondaryText }}>
                      Sin ejercicios
                    </p>
                  ) : (
                    dayExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="rounded-xl p-3 border transition-all hover:shadow-md"
                        style={{
                          backgroundColor: colors.cardBg,
                          borderColor: colors.border
                        }}
                      >
                        <h4 className="font-semibold text-sm mb-1" style={{ color: colors.primaryText }}>
                          {exercise.name}
                        </h4>
                        <p className="text-xs mb-2" style={{ color: colors.secondaryText }}>
                          {exercise.sets} series × {exercise.reps} reps
                        </p>
                        <div className="text-xs mb-2">
                          <span
                            className="px-2 py-1 rounded-full"
                            style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: '#00A896' }}
                          >
                            {exercise.zone}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="flex-1 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
                            title="Editar"
                          >
                            <Pencil size={14} style={{ color: '#00A896' }} />
                          </button>
                          <button
                            className="flex-1 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }}
                            title="Eliminar"
                          >
                            <Trash2 size={14} style={{ color: '#FF4D4D' }} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
