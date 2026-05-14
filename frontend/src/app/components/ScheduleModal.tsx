import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
}

const daysOfWeek = [
  { short: 'L', full: 'Lunes' },
  { short: 'M', full: 'Martes' },
  { short: 'M', full: 'Miércoles' },
  { short: 'J', full: 'Jueves' },
  { short: 'V', full: 'Viernes' },
  { short: 'S', full: 'Sábado' },
  { short: 'D', full: 'Domingo' },
];

export function ScheduleModal({ isOpen, onClose, exerciseName }: ScheduleModalProps) {
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 2, 4]);
  const [reps, setReps] = useState(15);
  const [sets, setSets] = useState(3);
  const { colors, theme } = useTheme();

  if (!isOpen) return null;

  const toggleDay = (index: number) => {
    setSelectedDays(prev =>
      prev.includes(index)
        ? prev.filter(d => d !== index)
        : [...prev, index]
    );
  };

  const handleConfirm = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="rounded-3xl shadow-2xl max-w-2xl w-full" style={{ backgroundColor: colors.surface }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 border-b" style={{ borderColor: colors.border }}>
            <h3 className="text-2xl lg:text-3xl" style={{ color: colors.primaryText, fontWeight: '700' }}>
              Programar Ejercicio
            </h3>
            <button
              onClick={onClose}
              className="p-2 lg:p-2.5 rounded-lg transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }}
            >
              <X size={24} className="lg:w-7 lg:h-7" style={{ color: colors.primaryText }} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
            {/* Exercise Name */}
            <div>
              <p className="text-sm lg:text-base mb-1" style={{ color: colors.secondaryText }}>Ejercicio</p>
              <p className="text-lg lg:text-xl" style={{ color: colors.primaryText, fontWeight: '600' }}>
                {exerciseName}
              </p>
            </div>

            {/* Day Selector */}
            <div>
              <label className="block text-sm lg:text-base mb-3 lg:mb-4" style={{ color: colors.primaryText, fontWeight: '600' }}>
                Días de la semana
              </label>
              <div className="flex gap-2 lg:gap-3 justify-between">
                {daysOfWeek.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleDay(index)}
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-full transition-all shadow-sm text-sm lg:text-base"
                    style={{
                      backgroundColor: selectedDays.includes(index) ? '#00A896' : colors.cardBg,
                      color: selectedDays.includes(index) ? '#ffffff' : colors.primaryText,
                      border: selectedDays.includes(index) ? 'none' : `2px solid ${colors.border}`,
                      fontWeight: selectedDays.includes(index) ? '700' : '500'
                    }}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Repetitions Stepper */}
            <div>
              <label className="block text-sm lg:text-base mb-3 lg:mb-4" style={{ color: colors.primaryText, fontWeight: '600' }}>
                Repeticiones por serie
              </label>
              <div className="flex items-center gap-4 lg:gap-6">
                <button
                  onClick={() => setReps(Math.max(1, reps - 1))}
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  style={{ backgroundColor: colors.cardBg, color: colors.primaryText, border: `1px solid ${colors.border}` }}
                >
                  <Minus size={20} className="lg:w-6 lg:h-6" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-4xl lg:text-5xl" style={{ color: '#00A896', fontWeight: '700' }}>
                    {reps}
                  </p>
                </div>
                <button
                  onClick={() => setReps(reps + 1)}
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  style={{ backgroundColor: '#00A896', color: '#ffffff' }}
                >
                  <Plus size={20} className="lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            {/* Sets Stepper */}
            <div>
              <label className="block text-sm lg:text-base mb-3 lg:mb-4" style={{ color: colors.primaryText, fontWeight: '600' }}>
                Número de series
              </label>
              <div className="flex items-center gap-4 lg:gap-6">
                <button
                  onClick={() => setSets(Math.max(1, sets - 1))}
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  style={{ backgroundColor: colors.cardBg, color: colors.primaryText, border: `1px solid ${colors.border}` }}
                >
                  <Minus size={20} className="lg:w-6 lg:h-6" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-4xl lg:text-5xl" style={{ color: '#00A896', fontWeight: '700' }}>
                    {sets}
                  </p>
                </div>
                <button
                  onClick={() => setSets(sets + 1)}
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  style={{ backgroundColor: '#00A896', color: '#ffffff' }}
                >
                  <Plus size={20} className="lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 lg:px-8 py-5 lg:py-6 border-t space-y-3 lg:space-y-4" style={{ borderColor: colors.border }}>
            <button
              onClick={handleConfirm}
              className="w-full py-4 lg:py-5 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl text-base lg:text-lg"
              style={{
                backgroundColor: '#00A896',
                color: '#ffffff',
                fontWeight: '600'
              }}
            >
              Confirmar y Guardar
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-center transition-all text-base lg:text-lg"
              style={{ color: colors.primaryText }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
