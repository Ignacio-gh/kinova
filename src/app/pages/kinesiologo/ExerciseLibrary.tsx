import { useState } from 'react';
import { Search, Dumbbell } from 'lucide-react';
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

const exercises: Exercise[] = [
  {
    id: 1,
    name: 'Sentadilla Búlgara',
    targetMuscles: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
    zone: 'Muslo',
    description: 'Ejercicio unilateral que fortalece los músculos del tren inferior, mejorando el equilibrio y la estabilidad.',
    benefits: ['Fortalece cuádriceps', 'Mejora equilibrio', 'Aumenta fuerza unilateral'],
    videoUrl: 'placeholder'
  },
  {
    id: 2,
    name: 'Extensión de Rodilla',
    targetMuscles: ['Cuádriceps'],
    zone: 'Rodilla',
    description: 'Ejercicio de aislamiento que trabaja específicamente el músculo cuádriceps, ideal para rehabilitación de rodilla.',
    benefits: ['Aísla cuádriceps', 'Fortalece rodilla', 'Mejora extensión'],
    videoUrl: 'placeholder'
  },
  {
    id: 3,
    name: 'Elevación de Talón',
    targetMuscles: ['Gemelos', 'Sóleo'],
    zone: 'Tobillo',
    description: 'Fortalece la musculatura de la pantorrilla, mejorando la flexión plantar y la estabilidad del tobillo.',
    benefits: ['Fortalece pantorrilla', 'Mejora propulsión', 'Estabiliza tobillo'],
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
  }
];

const zones = ['Todos', 'Cadera', 'Rodilla', 'Tobillo', 'Muslo', 'Glúteo'];

export function ExerciseLibrary() {
  const { colors } = useTheme();
  const [selectedZone, setSelectedZone] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = exercises.filter((exercise) => {
    const matchesZone = selectedZone === 'Todos' || exercise.zone === selectedZone;
    const matchesSearch =
      searchQuery === '' ||
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesZone && matchesSearch;
  });

  return (
    <main className="p-8 max-w-7xl mx-auto">
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
          {zones.map((zone) => (
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
              className="rounded-2xl border overflow-hidden transition-all hover:shadow-lg"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
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
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold" style={{ color: colors.primaryText }}>
                    {exercise.name}
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
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
          ))
        )}
      </div>
    </main>
  );
}
