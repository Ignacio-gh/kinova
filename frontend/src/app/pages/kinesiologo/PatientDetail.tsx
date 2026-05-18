import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Plus, CheckCircle, XCircle, Edit2, Trash2, X } from 'lucide-react';
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
  const location = useLocation();

  // --- Estados de Gestión de Tratamiento ---
  const [treatmentWeeks, setTreatmentWeeks] = useState<number>(
    location.state?.treatmentWeeks ? parseInt(location.state.treatmentWeeks) : 3
  );
  const [patientStatus, setPatientStatus] = useState<'Activo' | 'Finalizado'>('Activo');

  // --- Estados para la edición ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<{ day: string; exercise: Exercise } | null>(null);
  const [editSets, setEditSets] = useState(0);
  const [editReps, setEditReps] = useState(0);
  const [editMinAngle, setEditMinAngle] = useState<string>('');
  const [editMaxAngle, setEditMaxAngle] = useState<string>('');

  const patientName = 'Carlos Rodríguez';
  
  // Fecha de asignación base para el mock de este paciente
  const startDate = new Date(2026, 4, 11); // 11 de Mayo de 2026

  // Funciones de cálculo de fecha
  const getEndDateString = (weeks: number) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + weeks * 7 - 1);
    return endDate.toLocaleDateString('es-AR');
  };

  const getStartDateString = () => {
    return startDate.toLocaleDateString('es-AR');
  };

  // Cambiar estado con confirmación
  const handleToggleStatus = () => {
    if (patientStatus === 'Activo') {
      const confirmarFinalizar = window.confirm('¿Estás seguro de que querés finalizar el tratamiento del paciente?');
      if (confirmarFinalizar) {
        setPatientStatus('Finalizado');
      }
    } else {
      const confirmarActivar = window.confirm('¿Estás seguro de que querés volver a activar este paciente?');
      if (confirmarActivar) {
        setPatientStatus('Activo');
      }
    }
  };

  // Eliminar ejercicio con confirmación
  const handleDeleteExercise = (day: string, exerciseId: number) => {
    const ejercicioABorrar = exercises[day]?.find(ex => ex.id === exerciseId);
    const nombreEjercicio = ejercicioABorrar ? ejercicioABorrar.name : 'este ejercicio';

    const confirmar = window.confirm(`¿Estás seguro de que querés eliminar "${nombreEjercicio}" del día ${day}?`);

    if (confirmar) {
      setExercises((prevExercises) => ({
        ...prevExercises,
        [day]: prevExercises[day].filter((exercise) => exercise.id !== exerciseId),
      }));
    }
  };

  // Abrir modal de edición
  const handleOpenEditModal = (day: string, exercise: Exercise) => {
    setEditingExercise({ day, exercise });
    setEditSets(exercise.sets);
    setEditReps(exercise.reps);
    setEditMinAngle(exercise.minAngle !== undefined ? String(exercise.minAngle) : '');
    setEditMaxAngle(exercise.maxAngle !== undefined ? String(exercise.maxAngle) : '');
    setIsEditModalOpen(true);
  };

  // Guardar edición
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExercise) return;

    const { day, exercise } = editingExercise;

    const finalMin = editMinAngle.trim() === '' || editMinAngle === '-' ? undefined : parseInt(editMinAngle);
    const finalMax = editMaxAngle.trim() === '' || editMaxAngle === '-' ? undefined : parseInt(editMaxAngle);

    setExercises((prevExercises) => ({
      ...prevExercises,
      [day]: prevExercises[day].map((ex) =>
        ex.id === exercise.id
          ? { 
              ...ex, 
              sets: editSets, 
              reps: editReps,
              minAngle: finalMin !== undefined && finalMax !== undefined ? finalMin : undefined,
              maxAngle: finalMin !== undefined && finalMax !== undefined ? finalMax : undefined
            }
          : ex
      ),
    }));

    setIsEditModalOpen(false);
    setEditingExercise(null);
  };

  // Capturar asignaciones externas
  useEffect(() => {
    if (location.state?.nuevoEjercicio && location.state?.diaAsignado) {
      const { nuevoEjercicio, diaAsignado } = location.state;

      setExercises((prevExercises) => {
        const ejerciciosDelDia = prevExercises[diaAsignado] || [];
        
        if (ejerciciosDelDia.some(ex => ex.id === nuevoEjercicio.id)) {
          return prevExercises;
        }

        return {
          ...prevExercises,
          [diaAsignado]: [...ejerciciosDelDia, nuevoEjercicio]
        };
      });

      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <main className="p-8 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/kinesiologo')}
          className="flex items-center gap-2 mb-4 transition-colors hover:opacity-70"
          style={{ color: colors.secondaryText }}
        >
          <ArrowLeft size={20} />
          <span>Volver a Pacientes</span>
        </button>

        {/* Bloque Superior: Nombre y Adherencia */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-4xl mb-1 font-bold" style={{ color: colors.primaryText }}>
              {patientName}
            </h2>
            <p className="text-lg font-medium" style={{ color: '#00A896' }}>
              Lesión de rodilla izquierda • Post-operatorio, {treatmentWeeks} semanas de duración
            </p>
            <p className="text-xs mt-1 font-semibold tracking-wide" style={{ color: colors.secondaryText }}>
              Período de vigencia: {getStartDateString()} al {getEndDateString(treatmentWeeks)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm mb-0.5" style={{ color: colors.secondaryText }}>
              Adherencia al Tratamiento
            </p>
            <p className="text-4xl font-bold" style={{ color: '#28A745' }}>
              85%
            </p>
          </div>
        </div>

        {/* Bloque Inferior: Nota Médica y Controles Clínicos */}
        <div className="grid grid-cols-3 gap-6 items-center">
          {/* Notas Médicas */}
          <div 
            className="col-span-2 rounded-xl p-4 border text-sm leading-relaxed self-stretch flex flex-col justify-center"
            style={{ 
              backgroundColor: colors.cardBg, 
              borderColor: colors.border,
              color: colors.primaryText 
            }}
          >
            <span className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: colors.secondaryText }}>
              Notas Médicas / Observations:
            </span>
            <p>
              {location.state?.notes || "El paciente refiere molestia leve en la cara lateral externa al realizar flexión profunda. Monitorear rangos anulares en sentadillas."}
            </p>
          </div>

          {/* Panel Clínico de Control */}
          <div 
            className="border p-4 rounded-2xl flex items-center justify-between gap-4 shadow-md self-stretch"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
          >
            {/* Contador de Semanas */}
            <div className="text-center flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: colors.secondaryText }}>
                DURACIÓN
              </span>
              <div className="flex items-center justify-center gap-2">
                <button 
                  disabled={patientStatus === 'Finalizado'}
                  onClick={() => setTreatmentWeeks(prev => Math.max(1, prev - 1))}
                  className="w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs border hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ color: colors.primaryText, borderColor: colors.border }}
                >
                  -
                </button>
                <span className="font-bold text-xs min-w-[65px]" style={{ color: colors.primaryText }}>
                  {treatmentWeeks} Sem.
                </span>
                <button 
                  disabled={patientStatus === 'Finalizado'}
                  onClick={() => setTreatmentWeeks(prev => prev + 1)}
                  className="w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs border hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ color: colors.primaryText, borderColor: colors.border }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Divisor Vertical */}
            <div className="border-l h-8" style={{ borderColor: colors.border }} />

            {/* Estado del Paciente */}
            <div className="text-center flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: colors.secondaryText }}>
                ESTADO
              </span>
              <button
                onClick={handleToggleStatus}
                className="w-full py-1 rounded-xl text-[10px] font-bold transition-all shadow-sm select-none active:scale-95"
                style={{ 
                  backgroundColor: patientStatus === 'Activo' ? 'rgba(0, 168, 150, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: patientStatus === 'Activo' ? '#00A896' : '#EF4444',
                  border: `1px solid ${patientStatus === 'Activo' ? '#00A896' : '#EF4444'}`
                }}
              >
                {patientStatus === 'Activo' ? '● ACTIVO' : '■ FINAL'}
              </button>
            </div>
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
                    disabled={patientStatus === 'Finalizado'}
                    onClick={() => navigate('/kinesiologo/ejercicios', { state: { patientId: id, day: day } })}
                    className="w-full mb-3 py-2 px-3 rounded-lg border-2 border-dashed transition-all text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      borderColor: patientStatus === 'Finalizado' ? colors.border : '#00A896',
                      color: patientStatus === 'Finalizado' ? colors.secondaryText : '#00A896',
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

                        <p className="text-xs mb-2">
                          {exercise.minAngle !== undefined && exercise.maxAngle !== undefined ? (
                            <span style={{ color: '#00A896' }} className="font-medium">
                              Ángulo: {exercise.minAngle}° - {exercise.maxAngle}°
                            </span>
                          ) : (
                            <span style={{ color: colors.secondaryText }}>Ángulo: -</span>
                          )}
                        </p>

                        <div className="text-xs mb-3">
                          <span className="px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: '#00A896' }}>
                            {exercise.zone}
                          </span>
                        </div>

                        {/* BOTONES INTERACTIVOS CORREGIDOS CON HOVER Y ACTIVE EFFECT */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenEditModal(day, exercise)}
                            className="flex-1 p-1.5 rounded-lg transition-all hover:bg-teal-500/20 active:scale-95"
                            style={{ backgroundColor: 'rgba(0, 168, 150, 0.05)' }}
                            title="Editar"
                          >
                            <Edit2 size={12} style={{ color: '#00A896' }} />
                          </button>
                          <button
                            onClick={() => handleDeleteExercise(day, exercise.id)}
                            className="flex-1 p-1.5 rounded-lg transition-all hover:bg-red-500/20 active:scale-95"
                            style={{ backgroundColor: 'rgba(255, 77, 77, 0.05)' }}
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

      {/* --- MODAL FLOTANTE DE EDICIÓN CONFIGURABLE --- */}
      {isEditModalOpen && editingExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className="rounded-2xl border p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold" style={{ color: colors.primaryText }}>
                Editar Parámetros
              </h4>
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} style={{ color: colors.secondaryText }} />
              </button>
            </div>

            <p className="text-sm font-medium mb-4" style={{ color: '#00A896' }}>
              {editingExercise.exercise.name} ({editingExercise.day})
            </p>

            {/* Formulario */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: colors.secondaryText }}>
                    SERIES
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={editSets}
                    onChange={(e) => setEditSets(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                    style={{ 
                      borderColor: colors.border, 
                      backgroundColor: colors.surface,
                      color: colors.primaryText
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: colors.secondaryText }}>
                    REPETICIONES
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={editReps}
                    onChange={(e) => setEditReps(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                    style={{ 
                      borderColor: colors.border, 
                      backgroundColor: colors.surface,
                      color: colors.primaryText
                    }}
                  />
                </div>
              </div>

              {/* Ajuste de Ángulos con borrado dinámico */}
              <div className="pt-2 border-t" style={{ borderColor: colors.border }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="block text-xs font-semibold" style={{ color: colors.secondaryText }}>
                    RANGO ANULAR (BIOMECÁNICA)
                  </span>
                  <span className="text-[10px] opacity-60" style={{ color: colors.secondaryText }}>
                    Vacío o '-' para anular
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-medium mb-1" style={{ color: colors.secondaryText }}>
                      Mínimo (°)
                    </label>
                    <input 
                      type="text" 
                      placeholder="-"
                      value={editMinAngle}
                      onChange={(e) => setEditMinAngle(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      style={{ 
                        borderColor: colors.border, 
                        backgroundColor: colors.surface,
                        color: colors.primaryText
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-medium mb-1" style={{ color: colors.secondaryText }}>
                      Máximo (°)
                    </label>
                    <input 
                      type="text" 
                      placeholder="-"
                      value={editMaxAngle}
                      onChange={(e) => setEditMaxAngle(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      style={{ 
                        borderColor: colors.border, 
                        backgroundColor: colors.surface,
                        color: colors.primaryText
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50 dark:hover:bg-gray-900"
                  style={{ borderColor: colors.border, color: colors.secondaryText }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: '#00A896' }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
