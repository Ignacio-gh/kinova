import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { Check, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

interface Exercise {
  id: number;
  name: string;
  zone: string;
  reps: number;
  sets: number;
  day: string;
  completed: boolean;
}

const todayExercises: Exercise[] = [
  { id: 1, name: 'Sentadilla', zone: 'Muslo', reps: 20, sets: 3, day: 'Lunes', completed: false },
  { id: 2, name: 'Extensión Sentado', zone: 'Rodilla', reps: 15, sets: 3, day: 'Lunes', completed: false },
  { id: 3, name: 'Elevación de pierna recta', zone: 'Cadera', reps: 25, sets: 4, day: 'Lunes', completed: true },
];

const upcomingExercises: Exercise[] = [
  { id: 4, name: 'Elevación de Talón', zone: 'Tobillo', reps: 30, sets: 3, day: 'Martes', completed: false },
  { id: 5, name: 'Flexión de Cadera', zone: 'Muslo', reps: 12, sets: 3, day: 'Martes', completed: false },
  { id: 6, name: 'Zancada Frontal', zone: 'Muslo', reps: 15, sets: 3, day: 'Miércoles', completed: false },
];

export function PatientHome() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [exercises, setExercises] = useState(todayExercises);

  const patientName = 'Carlos';
  const completedThisWeek = 4;
  const totalThisWeek = 7;
  const progressPercentage = (completedThisWeek / totalThisWeek) * 100;

  const toggleExerciseComplete = (id: number) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1
          className="text-5xl mb-2"
          style={{
            fontFamily: 'Playball, cursive',
            color: colors.primaryText
          }}
        >
          Bienvenido, {patientName}
        </h1>
        <p className="text-lg" style={{ color: colors.secondaryText }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Today's Exercises Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold" style={{ color: colors.primaryText }}>
            Ejercicios de Hoy
          </h2>
          <div className="flex items-center gap-2">
            <Calendar size={20} style={{ color: colors.secondaryText }} />
            <span style={{ color: colors.secondaryText }}>
              {exercises.filter(ex => ex.completed).length} de {exercises.length} completados
            </span>
          </div>
        </div>

        {exercises.length === 0 ? (
          /* Empty State */
          <div
            className="rounded-3xl p-12 text-center border-2 border-dashed"
            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}>
              <Calendar size={40} style={{ color: '#00A896' }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.primaryText }}>
              ¡Día de descanso!
            </h3>
            <p className="text-lg" style={{ color: colors.secondaryText }}>
              No tienes ejercicios programados para hoy. Aprovecha para recuperarte.
            </p>
          </div>
        ) : (
          /* Exercise Cards - Horizontal Scroll */
          <div className="flex gap-6 overflow-x-auto pb-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex-shrink-0 w-96 rounded-3xl p-6 border transition-all hover:shadow-lg"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: exercise.completed ? '#28A745' : colors.border,
                  borderWidth: exercise.completed ? '2px' : '1px'
                }}
              >
                {/* Exercise Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.primaryText }}>
                      {exercise.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: '#00A896' }}
                      >
                        {exercise.zone}
                      </span>
                    </div>
                  </div>
                  {exercise.completed && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#28A745' }}>
                      <Check size={20} color="#ffffff" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Exercise Details */}
                <div className="mb-6">
                  <div className="flex items-center gap-6 mb-3">
                    <div>
                      <p className="text-sm" style={{ color: colors.secondaryText }}>Repeticiones</p>
                      <p className="text-2xl font-bold" style={{ color: colors.primaryText }}>{exercise.reps}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: colors.secondaryText }}>Series</p>
                      <p className="text-2xl font-bold" style={{ color: colors.primaryText }}>{exercise.sets}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/sesion/${exercise.id}`)}
                    className="w-full py-3 px-4 rounded-xl transition-all hover:shadow-md font-semibold flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: '#00A896',
                      color: '#ffffff'
                    }}
                  >
                    Ver ejercicio
                    <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={() => toggleExerciseComplete(exercise.id)}
                    className={`w-full py-3 px-4 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 ${
                      exercise.completed ? 'opacity-70' : ''
                    }`}
                    style={{
                      backgroundColor: exercise.completed ? '#28A745' : colors.border,
                      color: exercise.completed ? '#ffffff' : colors.primaryText
                    }}
                  >
                    <Check size={18} />
                    {exercise.completed ? 'Completado' : 'Marcar como completado'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Weekly Progress Section */}
        <div className="col-span-2">
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primaryText }}>
            Progreso Semanal
          </h2>

          <div
            className="rounded-3xl p-8 border"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg mb-2" style={{ color: colors.secondaryText }}>
                  Ejercicios completados
                </p>
                <p className="text-5xl font-bold" style={{ color: colors.primaryText }}>
                  {completedThisWeek}
                  <span className="text-3xl" style={{ color: colors.secondaryText }}>
                    {' '}/ {totalThisWeek}
                  </span>
                </p>
              </div>
              <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}>
                <TrendingUp size={40} style={{ color: '#00A896' }} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    backgroundColor: '#00A896',
                    width: `${progressPercentage}%`
                  }}
                />
              </div>
            </div>

            <p className="text-sm" style={{ color: colors.secondaryText }}>
              ¡Excelente trabajo! Estás al {Math.round(progressPercentage)}% de tu objetivo semanal.
            </p>
          </div>
        </div>

        {/* Upcoming Exercises Section */}
        <div className="col-span-1">
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primaryText }}>
            Próximos Ejercicios
          </h2>

          <div className="space-y-4">
            {upcomingExercises.slice(0, 3).map((exercise) => (
              <div
                key={exercise.id}
                className="rounded-2xl p-4 border transition-all hover:shadow-md"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm" style={{ color: colors.primaryText }}>
                    {exercise.name}
                  </h4>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.border, color: colors.secondaryText }}>
                    {exercise.day}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: colors.secondaryText }}>
                  {exercise.zone}
                </p>
                <p className="text-xs" style={{ color: colors.secondaryText }}>
                  {exercise.sets} series × {exercise.reps} reps
                </p>
              </div>
            ))}

            <button
              onClick={() => navigate('/paciente/calendario')}
              className="w-full py-3 px-4 rounded-xl transition-all hover:shadow-md font-semibold text-sm border"
              style={{
                borderColor: '#00A896',
                color: '#00A896',
                backgroundColor: 'transparent'
              }}
            >
              Ver rutina completa
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
