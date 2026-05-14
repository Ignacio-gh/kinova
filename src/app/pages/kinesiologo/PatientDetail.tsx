import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Plus, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
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
}

interface DayExercises {
  [key: string]: Exercise[];
}

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const mockExercises: DayExercises = {
  'Lunes': [
    { id: 1, name: 'Sentadilla Búlgara', zone: 'Muslo', reps: 20, sets: 3, minAngle: 60, maxAngle: 90, completed: true },
    { id: 2, name: 'Extensión de Rodilla', zone: 'Rodilla', reps: 15, sets: 3, completed: true },
  ],
  'Martes': [
    { id: 3, name: 'Elevación de Talón', zone: 'Tobillo', reps: 30, sets: 3, completed: false },
  ],
  'Miércoles': [
    { id: 4, name: 'Puente de Glúteo', zone: 'Glúteo', reps: 25, sets: 4, completed: false },
  ],
  'Jueves': [],
  'Viernes': [
    { id: 5, name: 'Zancada Frontal', zone: 'Muslo', reps: 15, sets: 3, minAngle: 70, maxAngle: 110, completed: false },
  ],
  'Sábado': [],
  'Domingo': []
};

export function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [exercises, setExercises] = useState<DayExercises>(mockExercises);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const patientName = 'Carlos Rodríguez';

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/kinesiologo/pacientes')}
          className="flex items-center gap-2 mb-4 transition-colors hover:opacity-70"
          style={{ color: colors.secondaryText }}
        >
          <ArrowLeft size={20} />
          <span>Volver a Pacientes</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl mb-2 font-bold" style={{ color: colors.primaryText }}>
              {patientName}
            </h2>
            <p className="text-lg" style={{ color: colors.secondaryText }}>
              Lesión de rodilla izquierda • Post-operatorio, 3 semanas
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm mb-1" style={{ color: colors.secondaryText }}>
              Adherencia al Tratamiento
            </p>
            <p className="text-4xl font-bold" style={{ color: '#28A745' }}>
              85%
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold" style={{ color: colors.primaryText }}>
            Rutina Semanal
          </h3>
        </div>

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
                  {/* Add Exercise Button */}
                  <button
                    onClick={() => {
                      setSelectedDay(day);
                      setShowAssignModal(true);
                    }}
                    className="w-full mb-3 py-2 px-3 rounded-lg border-2 border-dashed transition-all hover:border-solid text-sm font-medium"
                    style={{
                      borderColor: '#00A896',
                      color: '#00A896',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Plus size={16} className="inline mr-1" />
                    Asignar
                  </button>

                  {/* Exercises */}
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

                        <div className="text-xs">
                          <span className="px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: '#00A896' }}>
                            {exercise.zone}
                          </span>
                        </div>

                        <div className="flex gap-1 mt-3">
                          <button
                            className="flex-1 p-1.5 rounded-lg transition-colors"
                            style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
                            title="Editar"
                          >
                            <Edit2 size={12} style={{ color: '#00A896' }} />
                          </button>
                          <button
                            className="flex-1 p-1.5 rounded-lg transition-colors"
                            style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }}
                            title="Eliminar"
                          >
                            <Trash2 size={12} style={{ color: '#FF4D4D' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6 mt-8">
        <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Ejercicios Asignados</p>
          <p className="text-3xl font-bold" style={{ color: colors.primaryText }}>
            {Object.values(exercises).flat().length}
          </p>
        </div>

        <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Completados Esta Semana</p>
          <p className="text-3xl font-bold" style={{ color: '#28A745' }}>
            {Object.values(exercises).flat().filter(e => e.completed).length}
          </p>
        </div>

        <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Pendientes</p>
          <p className="text-3xl font-bold" style={{ color: '#FFC107' }}>
            {Object.values(exercises).flat().filter(e => !e.completed).length}
          </p>
        </div>

        <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p className="text-sm mb-2" style={{ color: colors.secondaryText }}>Días Activos</p>
          <p className="text-3xl font-bold" style={{ color: colors.primaryText }}>
            {Object.values(exercises).filter(dayEx => dayEx.length > 0).length}
          </p>
        </div>
      </div>
    </main>
  );
}
