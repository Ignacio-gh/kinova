import { useState } from 'react';
import { Trash2, Pencil, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';

const daysOfWeek = [
  { short: 'Lu', full: 'Lunes' },
  { short: 'Ma', full: 'Martes' },
  { short: 'Mi', full: 'Miércoles' },
  { short: 'Ju', full: 'Jueves' },
  { short: 'Vi', full: 'Viernes' },
  { short: 'Sa', full: 'Sábado' },
  { short: 'Do', full: 'Domingo' },
];

const exercises = [
  { id: 1, name: 'Sentadilla Búlgara', reps: 'x20', sets: '3 series', day: 'Lunes' },
  { id: 2, name: 'Extensión de Rodilla', reps: 'x15', sets: '3 series', day: 'Lunes' },
  { id: 3, name: 'Puente de Glúteo', reps: 'x25', sets: '4 series', day: 'Lunes' },
  { id: 4, name: 'Elevación de Talón', reps: 'x30', sets: '3 series', day: 'Martes' },
  { id: 5, name: 'Flexión de Cadera', reps: 'x12', sets: '3 series', day: 'Martes' },
];

export function MiRutina() {
  const [selectedDay, setSelectedDay] = useState(0);
  const navigate = useNavigate();
  const { colors } = useTheme();

  const currentDayExercises = exercises.filter(
    (ex) => ex.day === daysOfWeek[selectedDay].full
  );

  return (
    <main className="px-6 lg:px-8 py-6 lg:py-8 pb-24">
      {/* Title */}
      <h2 className="text-3xl lg:text-4xl mb-6 lg:mb-8" style={{ color: colors.primaryText, fontWeight: '700' }}>
        Mi Rutina
      </h2>

      {/* Weekly Calendar Strip */}
      <div className="flex gap-2 lg:gap-3 mb-8 lg:mb-10 overflow-x-auto pb-2">
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(index)}
            className="flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-2xl transition-all shadow-sm text-sm lg:text-base"
            style={{
              backgroundColor: selectedDay === index ? '#00A896' : colors.cardBg,
              color: selectedDay === index ? '#ffffff' : colors.primaryText,
              border: selectedDay === index ? 'none' : `1px solid ${colors.border}`,
              fontWeight: selectedDay === index ? '700' : '500'
            }}
          >
            {day.short}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-5">
        {currentDayExercises.length === 0 ? (
          <div className="text-center py-12 lg:col-span-2">
            <p className="lg:text-lg" style={{ color: colors.secondaryText }}>No hay ejercicios para este día</p>
          </div>
        ) : (
          currentDayExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-all border"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
                >
                  <div
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-full"
                    style={{ backgroundColor: '#00A896', opacity: 0.3 }}
                  />
                </div>

                {/* Exercise Info */}
                <div className="flex-1">
                  <h3 className="mb-1 text-base lg:text-lg" style={{ color: colors.primaryText, fontWeight: '600' }}>
                    {exercise.name}
                  </h3>
                  <p className="text-sm lg:text-base mb-1" style={{ color: colors.secondaryText }}>
                    {exercise.reps} • {exercise.sets}
                  </p>
                  <div className="flex gap-3 mt-2">
                    <button
                      className="p-1.5 lg:p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
                    >
                      <Pencil size={18} className="lg:w-5 lg:h-5" style={{ color: '#00A896' }} />
                    </button>
                    <button
                      className="p-1.5 lg:p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: colors.border }}
                    >
                      <Trash2 size={18} className="lg:w-5 lg:h-5" style={{ color: colors.secondaryText }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/ejercicios')}
        className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 w-16 h-16 lg:w-20 lg:h-20 rounded-full shadow-2xl hover:shadow-xl transition-all flex items-center justify-center"
        style={{ backgroundColor: '#00A896' }}
      >
        <Plus size={28} className="lg:w-10 lg:h-10" color="#ffffff" />
      </button>
    </main>
  );
}
