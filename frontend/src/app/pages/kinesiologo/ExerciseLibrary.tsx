import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Search, Dumbbell, Plus, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Exercise {
  id: number;
  name: string;
  targetMuscles: string[];
  zone: string;
  description: string;
  benefits: string[];
  videoUrl: string;
}

// Estructura para el mock de pacientes activos
interface Patient {
  id: number;
  name: string;
}

const exercises: Exercise[] = [

  {
    id: 1,
    name: 'Sentadilla',
    targetMuscles: ['Cuádriceps', 'Glúteo mayor', 'Isquiotibiales', 'Core'],
    zone: 'Muslo',
    description: 'Patrón de movimiento básico y poliarticular para desarrollar fuerza global en todo el miembro inferior.',
    benefits: ['Aumenta densidad ósea', 'Fortalece cadena cinética anterior', 'Funcionalidad diaria'],
    videoUrl: 'placeholder'
  },
  {
    id: 2,
    name: 'Extensión Sentado',
    targetMuscles: ['Cuádriceps femoral'],
    zone: 'Rodilla',
    description: 'Ejercicio cinético abierto ideal para el aislamiento muscular y control analítico de la extensión terminal de rodilla.',
    benefits: ['Aísla el vasto medial', 'Estabiliza la rótula', 'Seguro para fases tempranas'],
    videoUrl: 'placeholder'
  },
  {
    id: 3,
    name: 'Elevación de pierna recta',
    targetMuscles: ['Cuádriceps', 'Psoas ilíaco'],
    zone: 'Cadera',
    description: 'Ejercicio de activación muscular isométrico y concéntrico sin carga articular sobre la rodilla.',
    benefits: ['Evita inhibición del cuádriceps', 'Cero compresión patelar', 'Fortalece flexores'],
    videoUrl: 'placeholder'
  },
  {
    id: 4,
    name: 'Puente de Glúteo',
    targetMuscles: ['Glúteos', 'Isquiotibiales', 'Core'],
    zone: 'Glúteo',
    description: 'Ejercicio fundamental para activar y fortalecer los glúteos, mejorando la extensión de cadera.',
    benefits: ['Activa glúteos', 'Fortalece cadena posterior', 'Mejora postura'],
    videoUrl: 'placeholder'
  },
  {
    id: 5,
    name: 'Zancada Frontal',
    targetMuscles: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
    zone: 'Muslo',
    description: 'Ejercicio funcional que trabaja todo el tren inferior de forma unilateral, mejorando coordinación y fuerza.',
    benefits: ['Fortalece tren inferior', 'Mejora coordinación', 'Trabajo unilateral'],
    videoUrl: 'placeholder'
  },
  {
    id: 6,
    name: 'Curl Nórdico',
    targetMuscles: ['Isquiotibiales'],
    zone: 'Muslo',
    description: 'Ejercicio excéntrico intenso para los isquiotibiales, excelente para prevención de lesiones.',
    benefits: ['Fortalece isquiotibiales', 'Previene lesiones', 'Trabajo excéntrico'],
    videoUrl: 'placeholder'
  },
  {
    id: 7,
    name: 'Abducción de Cadera',
    targetMuscles: ['Glúteo medio', 'Glúteo menor'],
    zone: 'Cadera',
    description: 'Ejercicio de aislamiento para los abductores de cadera, crucial para la estabilidad pélvica.',
    benefits: ['Fortalece abductores', 'Estabiliza pelvis', 'Mejora marcha'],
    videoUrl: 'placeholder'
  },
  {
    id: 8,
    name: 'Flexión Plantar con Banda',
    targetMuscles: ['Gemelos', 'Sóleo', 'Tibial posterior'],
    zone: 'Tobillo',
    description: 'Ejercicio con resistencia progresiva para fortalecer la musculatura del tobillo en flexión plantar.',
    benefits: ['Fortalece tobillo', 'Mejora movilidad', 'Rehabilitación'],
    videoUrl: 'placeholder'
  },
  {
    id: 9,
    name: 'Step Up',
    targetMuscles: ['Cuádriceps', 'Glúteos'],
    zone: 'Muslo',
    description: 'Ejercicio funcional que simula actividades cotidianas como subir escaleras, ideal para rehabilitación.',
    benefits: ['Fortalece tren inferior', 'Funcional', 'Mejora movilidad'],
    videoUrl: 'placeholder'
  },
  {
    id: 10,
    name: 'Sentadilla Asistida',
    targetMuscles: ['Cuádriceps', 'Glúteos', 'Core'],
    zone: 'Muslo',
    description: 'Variante de sentadilla con soporte, perfecta para pacientes en etapas iniciales de rehabilitación.',
    benefits: ['Bajo impacto', 'Fortalece tren inferior', 'Progresión segura'],
    videoUrl: 'placeholder'
  },
  {
    id: 11,
    name: 'Dorsiflexión con Banda',
    targetMuscles: ['Tibial anterior'],
    zone: 'Tobillo',
    description: 'Ejercicio para fortalecer el tibial anterior, mejorando la dorsiflexión del tobillo.',
    benefits: ['Fortalece tibial anterior', 'Previene caídas', 'Mejora marcha'],
    videoUrl: 'placeholder'
  },
  {
    id: 12,
    name: 'Clamshell',
    targetMuscles: ['Glúteo medio', 'Rotadores externos'],
    zone: 'Cadera',
    description: 'Ejercicio de activación para los rotadores externos de cadera, fundamental para estabilidad.',
    benefits: ['Activa rotadores', 'Estabiliza cadera', 'Previene lesiones'],
    videoUrl: 'placeholder'
  },
  {
    id: 13,
    name: 'Sentadilla Búlgara',
    targetMuscles: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
    zone: 'Muslo',
    description: 'Ejercicio unilateral que fortalece los músculos del tren inferior, mejorando el equilibrio y la estabilidad.',
    benefits: ['Fortalece cuádriceps', 'Mejora equilibrio', 'Aumenta fuerza unilateral'],
    videoUrl: 'placeholder'
  },
  {
    id: 14,
    name: 'Extensión de Rodilla',
    targetMuscles: ['Cuádriceps'],
    zone: 'Rodilla',
    description: 'Ejercicio de aislamiento que trabaja específicamente el músculo cuádriceps, ideal para rehabilitación de rodilla.',
    benefits: ['Aísla cuádriceps', 'Fortalece rodilla', 'Mejora extensión'],
    videoUrl: 'placeholder'
  },
  {
    id: 15,
    name: 'Elevación de Talón',
    targetMuscles: ['Gemelos', 'Sóleo'],
    zone: 'Tobillo',
    description: 'Fortalece la musculatura de la pantorrilla, mejorando la flexión plantar y la estabilidad del tobillo.',
    benefits: ['Fortalece pantorrilla', 'Mejora propulsión', 'Estabiliza tobillo'],
    videoUrl: 'placeholder'
  }
];

const zones = ['Todos', 'Cadera', 'Rodilla', 'Tobillo', 'Muslo', 'Glúteo'];
const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Mock de pacientes para el selector desplegable
const mockPatients: Patient[] = [
  { id: 1, name: 'Carlos Rodríguez' },
  { id: 2, name: 'María Mancini' },
  { id: 3, name: 'Juan Pedro López' }
];

export function ExerciseLibrary() {
  const { colors } = useTheme();
  const location = useLocation();
  const [selectedZone, setSelectedZone] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // --- Estados para el Modal de Asignación ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Captura inteligente desde react-router-dom state (si existen)
  const [assignPatient, setAssignPatient] = useState<string>(location.state?.patientId ? String(location.state.patientId) : '');
  const [assignDay, setAssignDay] = useState<string>(location.state?.day || '');
  const [assignSets, setAssignSets] = useState<number>(3);
  const [assignReps, setAssignReps] = useState<number>(10);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesZone = selectedZone === 'Todos' || exercise.zone === selectedZone;
    const matchesSearch =
      searchQuery === '' ||
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesZone && matchesSearch;
  });

  const handleOpenAssignModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    
    // Si entramos desde "Asignar" del paciente, respetamos el hook de origen,
    // si no, forzamos que se abran las opciones vacías.
    if (!location.state?.patientId) {
      setAssignPatient('');
      setAssignDay('');
    }
    
    setIsModalOpen(true);
  };

const handleConfirmAssignment = (e: React.FormEvent) => {
  e.preventDefault();
  if (!assignPatient || !assignDay || !selectedExercise) {
    alert('Por favor complete el Paciente y el Día de la semana.');
    return;
  }

  // Creamos el objeto con la misma estructura que espera el paciente
  const nuevoEjercicioTemporal = {
    id: Date.now(), // ID dinámico temporal para evitar colisiones
    name: selectedExercise.name,
    zone: selectedExercise.zone,
    reps: assignReps,
    sets: assignSets,
    completed: false
  };

  setIsModalOpen(false);
  setSelectedExercise(null);

  // Redirigimos de vuelta al detalle del paciente enviando el ejercicio y el día elegido
  navigate(`/kinesiologo/pacientes/${assignPatient}`, {
    state: { 
      nuevoEjercicio: nuevoEjercicioTemporal,
      diaAsignado: assignDay
    }
  });
};

  return (
    <main className="p-8 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl mb-2 font-bold" style={{ color: colors.primaryText }}>
          Biblioteca de Ejercicios
        </h2>
        <p className="text-lg" style={{ color: colors.secondaryText }}>
          Catálogo completo de ejercicios de tren inferior para rehabilitación
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            size={20}
            style={{ color: colors.secondaryText }}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o músculo objetivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: colors.inputBg,
              borderColor: colors.border,
              color: colors.primaryText,
              '--tw-ring-color': '#00A896'
            } as React.CSSProperties}
          />
        </div>

        {/* Zone Filters */}
        <div className="flex gap-2">
          {daysOfWeek.map && zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className="px-4 py-3 rounded-xl transition-all font-medium"
              style={{
                backgroundColor: selectedZone === zone ? '#00A896' : colors.cardBg,
                color: selectedZone === zone ? '#ffffff' : colors.primaryText,
                border: selectedZone === zone ? 'none' : `1px solid ${colors.border}`
              }}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredExercises.length === 0 ? (
          <div className="col-span-3 text-center py-12 rounded-2xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <Dumbbell size={48} className="mx-auto mb-4" style={{ color: colors.secondaryText }} />
            <p className="text-lg" style={{ color: colors.secondaryText }}>
              No se encontraron ejercicios
            </p>
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="rounded-2xl border overflow-hidden transition-all hover:shadow-lg relative flex flex-col justify-between"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
              <div>
                {/* Video Placeholder */}
                <div
                  className="h-48 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
                >
                  <div className="text-center">
                    <Dumbbell size={48} style={{ color: '#00A896' }} className="mx-auto mb-2" />
                    <p className="text-sm font-medium" style={{ color: '#00A896' }}>
                      Aca se ponen los videos
                    </p>
                  </div>
                </div>

                {/* Exercise Info */}
                <div className="p-5 pb-16"> {/* Margen inferior extra para que el botón flotante no tape el contenido */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: colors.primaryText }}>
                      {exercise.name}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)', color: '#00A896' }}
                    >
                      {exercise.zone}
                    </span>
                  </div>

                  {/* Target Muscles */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold mb-2" style={{ color: colors.secondaryText }}>
                      Músculos Objetivo:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.targetMuscles.map((muscle, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: 'rgba(0, 168, 150, 0.08)',
                            color: colors.primaryText
                          }}
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-3" style={{ color: colors.secondaryText }}>
                    {exercise.description}
                  </p>

                  {/* Benefits */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: colors.secondaryText }}>
                      Beneficios:
                    </p>
                    <ul className="space-y-1">
                      {exercise.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-start gap-2"
                          style={{ color: colors.primaryText }}
                        >
                          <span style={{ color: '#00A896' }}>•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Botoncito Flotante "+" abajo a la derecha de la tarjeta */}
              <button
                onClick={() => handleOpenAssignModal(exercise)}
                className="absolute bottom-4 right-4 p-3 bg-[#00A896] text-white rounded-xl shadow-md hover:bg-[#008f80] active:scale-95 transition-all z-10"
                title="Asignar Ejercicio"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- MODAL FLOTANTE DE ASIGNACIÓN (CENTRADITO) --- */}
      {isModalOpen && selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className="rounded-2xl border p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold" style={{ color: colors.primaryText }}>
                Asignar Ejercicio
              </h4>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} style={{ color: colors.secondaryText }} />
              </button>
            </div>

            <p className="text-sm font-medium mb-4" style={{ color: '#00A896' }}>
              Configuración para: {selectedExercise.name}
            </p>

            <form onSubmit={handleConfirmAssignment} className="space-y-4">
              {/* Desplegable de Pacientes */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: colors.secondaryText }}>
                  PACIENTE ACTIVO
                </label>
                <select
                  value={assignPatient}
                  onChange={(e) => setAssignPatient(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  style={{ borderColor: colors.border, backgroundColor: colors.surface, color: colors.primaryText }}
                >
                  <option value="" disabled>Seleccione un paciente...</option>
                  {mockPatients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Desplegable de Días de la semana */}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: colors.secondaryText }}>
                  DÍA DE ASIGNACIÓN
                </label>
                <select
                  value={assignDay}
                  onChange={(e) => setAssignDay(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  style={{ borderColor: colors.border, backgroundColor: colors.surface, color: colors.primaryText }}
                >
                  <option value="" disabled>Seleccione un día...</option>
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Inputs numéricos para Series y Repeticiones */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: colors.secondaryText }}>
                    SERIES
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={assignSets}
                    onChange={(e) => setAssignSets(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                    style={{ borderColor: colors.border, backgroundColor: colors.surface, color: colors.primaryText }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: colors.secondaryText }}>
                    REPETICIONES
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={assignReps}
                    onChange={(e) => setAssignReps(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                    style={{ borderColor: colors.border, backgroundColor: colors.surface, color: colors.primaryText }}
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  Confirmar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
