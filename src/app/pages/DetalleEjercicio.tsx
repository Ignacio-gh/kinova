import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Play } from 'lucide-react';
import { ScheduleModal } from '../components/ScheduleModal';
import { useTheme } from '../context/ThemeContext';

const exerciseDetails: Record<string, {
  name: string;
  zone: string;
  targetMuscles: string[];
  description: string[];
  benefits: string[];
}> = {
  '1': {
    name: 'Sentadilla Búlgara',
    zone: 'Muslo',
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
    <main>
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        exerciseName={exercise.name}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-72 z-10 p-3 backdrop-blur-sm rounded-xl shadow-lg transition-all"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)'
        }}
      >
        <ArrowLeft size={24} style={{ color: theme === 'dark' ? '#ffffff' : '#002B49' }} />
      </button>

      {/* Hero Video/Image Placeholder */}
      <button
        onClick={() => navigate(`/sesion/${id}`)}
        className="relative h-96 flex items-center justify-center w-full transition-all hover:brightness-110"
        style={{
          background: 'linear-gradient(135deg, #003d5c 0%, #002B49 100%)',
        }}
      >
        <div className="text-center">
          <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all mx-auto mb-4">
            <Play size={48} color="#ffffff" fill="#ffffff" />
          </div>
          <p className="text-white/60 text-lg font-medium">Aca se ponen los videos</p>
        </div>
      </button>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {/* Column 1: Title and Diagram */}
          <div className="col-span-1 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-4xl mb-2" style={{ color: colors.primaryText, fontWeight: '700' }}>
                {exercise.name}
              </h2>
              <p className="text-lg" style={{ color: colors.secondaryText }}>{exercise.zone}</p>
            </div>

            {/* Anatomical Diagram - Legs Only */}
            <div className="rounded-3xl p-8 border" style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border
            }}>
              <h3 className="mb-6 text-xl font-semibold" style={{ color: colors.primaryText }}>
                Zonas Objetivo
              </h3>
              <div className="flex items-center justify-center">
                {/* Legs-focused diagram */}
                <div className="relative w-48 h-80">
                  <svg viewBox="0 0 160 320" className="w-full h-full">
                    {/* Pelvis/Hip area */}
                    <rect x="55" y="10" width="50" height="30" rx="8" fill={theme === 'dark' ? '#d1d5db' : '#6b7280'} opacity="0.2" />

                    {/* Upper legs (Thighs) - Highlighted */}
                    <rect x="60" y="45" width="18" height="110" rx="8" fill="#00A896" opacity="0.8" />
                    <rect x="82" y="45" width="18" height="110" rx="8" fill="#00A896" opacity="0.8" />

                    {/* Knees - Highlighted differently */}
                    <circle cx="69" cy="165" r="12" fill="#00A896" />
                    <circle cx="91" cy="165" r="12" fill="#00A896" />

                    {/* Lower legs (Calves) */}
                    <rect x="62" y="180" width="14" height="100" rx="6" fill="#00A896" opacity="0.5" />
                    <rect x="84" y="180" width="14" height="100" rx="6" fill="#00A896" opacity="0.5" />

                    {/* Ankles */}
                    <circle cx="69" cy="290" r="8" fill="#00A896" opacity="0.6" />
                    <circle cx="91" cy="290" r="8" fill="#00A896" opacity="0.6" />

                    {/* Feet */}
                    <ellipse cx="69" cy="305" rx="12" ry="8" fill={theme === 'dark' ? '#d1d5db' : '#6b7280'} opacity="0.3" />
                    <ellipse cx="91" cy="305" rx="12" ry="8" fill={theme === 'dark' ? '#d1d5db' : '#6b7280'} opacity="0.3" />
                  </svg>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {exercise.targetMuscles.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: '#00A896',
                      color: '#ffffff',
                    }}
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Description */}
          <div className="col-span-1">
            <h3 className="mb-6 text-2xl font-semibold" style={{ color: colors.primaryText }}>
              Descripción
            </h3>
            <ul className="space-y-4">
              {exercise.description.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: '#00A896',
                      color: '#ffffff',
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="leading-relaxed text-base" style={{ color: colors.primaryText }}>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Benefits */}
          <div className="col-span-1">
            <h3 className="mb-6 text-2xl font-semibold" style={{ color: colors.primaryText }}>
              Beneficios
            </h3>
            <ul className="space-y-4">
              {exercise.benefits.map((benefit, index) => (
                <li key={index} className="flex gap-4">
                  <span className="text-2xl flex-shrink-0" style={{ color: '#28A745' }}>✓</span>
                  <span className="leading-relaxed text-base" style={{ color: colors.primaryText }}>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Add to Routine Button */}
            <div className="mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
                style={{
                  backgroundColor: '#00A896',
                  color: '#ffffff',
                }}
              >
                Añadir a mi rutina
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
