import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Play } from 'lucide-react';
import { ScheduleModal } from '../components/ScheduleModal';
import { useTheme } from '../context/ThemeContext';

const exerciseDetails = {
  '1': {
    name: 'Sentadilla Búlgara',
    zone: 'Pierna',
    targetMuscles: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
    description: [
      'Coloca un pie elevado detrás de ti sobre un banco o superficie estable',
      'Mantén el torso erguido y el peso en el talón delantero',
      'Desciende controladamente hasta que la rodilla trasera casi toque el suelo',
      'Empuja con el talón delantero para volver a la posición inicial',
    ],
    benefits: [
      'Fortalecimiento de cuádriceps y glúteos',
      'Mejora del equilibrio y estabilidad unilateral',
      'Desarrollo de fuerza funcional para actividades diarias',
      'Corrección de desbalances musculares entre piernas',
    ],
  },
  '2': {
    name: 'Extensión de Rodilla',
    zone: 'Rodilla',
    targetMuscles: ['Cuádriceps'],
    description: [
      'Siéntate con la espalda apoyada y las rodillas dobladas a 90°',
      'Extiende lentamente la rodilla hasta que la pierna esté recta',
      'Mantén la tensión en el cuádriceps por 2 segundos',
      'Regresa controladamente a la posición inicial',
    ],
    benefits: [
      'Fortalecimiento específico del cuádriceps',
      'Rehabilitación post-lesión de rodilla',
      'Mejora de la extensión completa de rodilla',
      'Prevención de atrofia muscular',
    ],
  },
};

export function DetalleEjercicio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { colors, theme } = useTheme();
  const exercise = exerciseDetails[id as keyof typeof exerciseDetails] || exerciseDetails['1'];

  return (
    <main className="pb-8">
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        exerciseName={exercise.name}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 lg:top-8 lg:left-8 z-10 p-2 lg:p-3 backdrop-blur-sm rounded-xl shadow-lg transition-all"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)'
        }}
      >
        <ArrowLeft size={24} className="lg:w-7 lg:h-7" style={{ color: theme === 'dark' ? '#ffffff' : '#002B49' }} />
      </button>

      {/* Hero Video/Image Placeholder */}
      <button
        onClick={() => navigate(`/sesion/${id}`)}
        className="relative h-64 lg:h-96 flex items-center justify-center w-full transition-all hover:brightness-110"
        style={{
          background: 'linear-gradient(135deg, #003d5c 0%, #002B49 100%)',
        }}
      >
        <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
          <Play size={32} className="lg:w-12 lg:h-12" color="#ffffff" fill="#ffffff" />
        </div>
      </button>

      <div className="px-6 lg:px-8 py-6 lg:py-8 space-y-8 lg:space-y-10 max-w-4xl mx-auto">
        {/* Title */}
        <div>
          <h2 className="text-3xl lg:text-5xl mb-2" style={{ color: colors.primaryText, fontWeight: '700' }}>
            {exercise.name}
          </h2>
          <p className="text-base lg:text-lg" style={{ color: colors.secondaryText }}>{exercise.zone}</p>
        </div>

        {/* Anatomical Diagram */}
        <div className="rounded-3xl p-8 lg:p-10" style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, rgba(0,66,102,0.5) 0%, rgba(0,61,92,0.5) 100%)'
            : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
        }}>
          <h3 className="mb-4 lg:mb-6 text-lg lg:text-xl" style={{ color: colors.primaryText, fontWeight: '600' }}>
            Zonas Objetivo
          </h3>
          <div className="flex items-center justify-center">
            {/* Simple body silhouette representation */}
            <div className="relative w-40 h-56 lg:w-52 lg:h-72">
              <svg viewBox="0 0 160 224" className="w-full h-full">
                {/* Head */}
                <circle cx="80" cy="20" r="18" fill={theme === 'dark' ? '#d1d5db' : '#002B49'} opacity="0.3" />
                {/* Torso */}
                <rect x="60" y="40" width="40" height="60" rx="8" fill={theme === 'dark' ? '#d1d5db' : '#002B49'} opacity="0.3" />
                {/* Arms */}
                <rect x="30" y="50" width="25" height="50" rx="6" fill={theme === 'dark' ? '#d1d5db' : '#002B49'} opacity="0.3" />
                <rect x="105" y="50" width="25" height="50" rx="6" fill={theme === 'dark' ? '#d1d5db' : '#002B49'} opacity="0.3" />
                {/* Legs - Highlighted */}
                <rect x="65" y="105" width="12" height="70" rx="6" fill="#00A896" />
                <rect x="83" y="105" width="12" height="70" rx="6" fill="#00A896" />
                {/* Lower legs */}
                <rect x="65" y="180" width="12" height="40" rx="6" fill="#00A896" opacity="0.5" />
                <rect x="83" y="180" width="12" height="40" rx="6" fill="#00A896" opacity="0.5" />
              </svg>
            </div>
          </div>
          <div className="mt-4 lg:mt-6 flex flex-wrap gap-2 lg:gap-3 justify-center">
            {exercise.targetMuscles.map((muscle) => (
              <span
                key={muscle}
                className="px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm lg:text-base"
                style={{
                  backgroundColor: '#00A896',
                  color: '#ffffff',
                  fontWeight: '500',
                }}
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="mb-4 lg:mb-6 text-xl lg:text-2xl" style={{ color: colors.primaryText, fontWeight: '600' }}>
            Descripción
          </h3>
          <ul className="space-y-3 lg:space-y-4">
            {exercise.description.map((step, index) => (
              <li key={index} className="flex gap-3 lg:gap-4">
                <span
                  className="flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-sm lg:text-base"
                  style={{
                    backgroundColor: '#00A896',
                    color: '#ffffff',
                    fontWeight: '600',
                  }}
                >
                  {index + 1}
                </span>
                <span className="leading-relaxed text-base lg:text-lg" style={{ color: colors.primaryText }}>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div>
          <h3 className="mb-4 lg:mb-6 text-xl lg:text-2xl" style={{ color: colors.primaryText, fontWeight: '600' }}>
            Beneficios
          </h3>
          <ul className="space-y-3 lg:space-y-4">
            {exercise.benefits.map((benefit, index) => (
              <li key={index} className="flex gap-3 lg:gap-4">
                <span className="text-lg lg:text-xl" style={{ color: '#00A896' }}>✓</span>
                <span className="leading-relaxed text-base lg:text-lg" style={{ color: colors.primaryText }}>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Add to Routine Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full lg:w-auto lg:px-12 py-4 lg:py-5 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl text-base lg:text-lg"
          style={{
            backgroundColor: '#00A896',
            color: '#ffffff',
            fontWeight: '600',
          }}
        >
          Añadir a mi rutina
        </button>
      </div>
    </main>
  );
}
