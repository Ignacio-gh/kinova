import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, XCircle, Play, Camera, User } from 'lucide-react';
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
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [exercises, setExercises] = useState<DayExercises>(mockExercises);

  // Nombre del kinesiólogo asignado (Hardcodeado temporalmente para el MVP)
  const kinesiologoName = 'Lic. Ignacio Ghiggi';

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
      <div className="mb-6">
        <h2 className="text-4xl mb-2 font-bold" style={{ color: colors.primaryText }}>
          Mi Calendario Semanal
        </h2>
        <p className="text-lg" style={{ color: colors.secondaryText }}>
          Visualiza y completa tus ejercicios asignados
        </p>
      </div>

      {/* MENSAJE INFORMATIVO CON EL KINESIÓLOGO ASIGNADO */}
      <div 
        className="mb-6 rounded-2xl p-4 border flex items-center gap-3 text-sm font-medium shadow-sm"
        style={{ 
          backgroundColor: colors.cardBg, 
          borderColor: colors.border,
          color: colors.primaryText 
        }}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
        >
          <User size={16} style={{ color: '#00A896' }} />
        </div>
        <p>
          Tu rutina actual fue proporcionada y supervisada por el profesional:{' '}
          <span className="font-bold" style={{ color: '#00A896' }}>
            {kinesiologoName}
          </span>
        </p>
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

                        {/* Actions apiladas de forma vertical responsiva */}
                        <div className="flex flex-col gap-2">
                          {/* Botón principal: Iniciar */}
                          <button
                            onClick={() => navigate(`/sesion/${exercise.id}`)}
                            className="w-full flex items-center justify-center gap-1 p-2 rounded-lg transition-all text-xs font-semibold hover:shadow-md"
                            style={{ backgroundColor: '#00A896', color: '#ffffff' }}
                            title="Iniciar ejercicio con cámara e IA"
                          >
                            <Camera size={12} />
                            Iniciar
                          </button>

                          {/* Botón Secundario: Video (Si tiene) */}
                          {exercise.hasVideo && (
                            <button
                              className="w-full flex items-center justify-center gap-1 p-2 rounded-lg transition-colors text-xs font-medium"
                              style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: '#00A896' }}
                              title="Ver video demo"
                            >
                              <Play size={12} />
                              Video Demo
                            </button>
                          )}

                          {/* Botón de Estado: Marcar / Completado */}
                          <button
                            onClick={() => toggleCompleted(day, exercise.id)}
                            className="w-full p-2 rounded-lg transition-colors text-xs font-medium"
                            style={{
                              backgroundColor: exercise.completed ? 'rgba(40, 167, 69, 0.1)' : 'rgba(0, 168, 150, 0.1)',
                              color: exercise.completed ? '#28A745' : '#00A896'
                            }}
                          >
                            {exercise.completed ? '✓ Completado' : 'Marcar Listo'}
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
