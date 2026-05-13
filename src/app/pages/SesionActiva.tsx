import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { X, Pause, Play } from 'lucide-react';

type FeedbackState = 'perfect' | 'improve' | 'bad';

const feedbackConfig = {
  perfect: {
    bg: '#4CAF50',
    text: '¡Postura Correcta!',
    icon: '✓'
  },
  improve: {
    bg: '#FFC107',
    text: 'Mejorar Postura',
    icon: '⚠'
  },
  bad: {
    bg: '#FF4D4D',
    text: 'Postura Incorrecta',
    icon: '✕'
  }
};

const exerciseSteps = [
  'Mantén la espalda recta en todo momento',
  'Baja lentamente y de forma controlada',
  'No bloquees las rodillas en la extensión',
  'Mantén el peso en el talón delantero',
  'Controla la respiración durante el movimiento',
];

const aiFeedbackMessages = [
  'Mantén el equilibrio en la pierna izquierda',
  'Baja un poco más la cadera',
  '¡Excelente! Mantén esa postura',
  'Alinea la rodilla con el tobillo',
];

export function SesionActiva() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPaused, setIsPaused] = useState(false);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('perfect');
  const [currentFeedback, setCurrentFeedback] = useState(aiFeedbackMessages[0]);
  const [reps, setReps] = useState(0);

  useEffect(() => {
    const feedbackInterval = setInterval(() => {
      const states: FeedbackState[] = ['perfect', 'improve', 'bad', 'perfect'];
      const randomState = states[Math.floor(Math.random() * states.length)];
      setFeedbackState(randomState);

      const randomMessage = aiFeedbackMessages[Math.floor(Math.random() * aiFeedbackMessages.length)];
      setCurrentFeedback(randomMessage);
    }, 4000);

    return () => clearInterval(feedbackInterval);
  }, []);

  const config = feedbackConfig[feedbackState];

  return (
    <div className="fixed inset-0 bg-black flex">
      {/* Main Camera View */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6 bg-black/50 backdrop-blur-sm">
          <div className="px-6 py-3 bg-black/50 backdrop-blur-sm rounded-2xl">
            <p className="text-white text-sm mb-1">Repeticiones</p>
            <p className="text-white text-4xl font-bold">{reps}</p>
          </div>

          <button
            onClick={() => navigate('/app')}
            className="p-4 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
          >
            <X size={28} color="#ffffff" />
          </button>
        </div>

        {/* Camera View with AR Overlay */}
        <div className="flex-1 relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <p className="text-white/60 text-xl font-medium mb-8">Aca se ponen los videos</p>
          </div>
          {/* AR Overlay focused on legs */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="400" height="500" viewBox="0 0 400 500" className="drop-shadow-2xl">
              {/* Hip joint */}
              <circle cx="200" cy="100" r="12" fill="#00A896" className="animate-pulse" />

              {/* Legs - connecting lines */}
              <line x1="200" y1="100" x2="170" y2="250" stroke="#00A896" strokeWidth="4" opacity="0.8" />
              <line x1="200" y1="100" x2="230" y2="250" stroke="#00A896" strokeWidth="4" opacity="0.8" />

              {/* Knee joints */}
              <circle cx="170" cy="250" r="14" fill="#00A896" className="animate-pulse" />
              <circle cx="230" cy="250" r="14" fill="#00A896" className="animate-pulse" />
              <circle cx="170" cy="250" r="20" fill="none" stroke="#00A896" strokeWidth="2" opacity="0.4" />
              <circle cx="230" cy="250" r="20" fill="none" stroke="#00A896" strokeWidth="2" opacity="0.4" />

              {/* Lower legs */}
              <line x1="170" y1="250" x2="165" y2="420" stroke="#00A896" strokeWidth="4" opacity="0.8" />
              <line x1="230" y1="250" x2="235" y2="420" stroke="#00A896" strokeWidth="4" opacity="0.8" />

              {/* Ankle joints */}
              <circle cx="165" cy="420" r="10" fill="#00A896" className="animate-pulse" />
              <circle cx="235" cy="420" r="10" fill="#00A896" className="animate-pulse" />
            </svg>
          </div>

          {/* Pause/Play Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-7 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
          >
            {isPaused ? (
              <Play size={40} color="#ffffff" fill="#ffffff" />
            ) : (
              <Pause size={40} color="#ffffff" fill="#ffffff" />
            )}
          </button>
        </div>
      </div>

      {/* Right Side Panel - Real-time Feedback */}
      <div className="w-96 bg-white flex flex-col">
        {/* Feedback Status Bar */}
        <div
          className="py-6 transition-all duration-500"
          style={{ backgroundColor: config.bg }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <p className="text-white text-2xl font-semibold">{config.text}</p>
          </div>
        </div>

        {/* Instructions and Feedback */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-2xl mb-4 font-semibold" style={{ color: '#002B49' }}>
              Pasos a seguir
            </h3>
            <div className="space-y-3">
              {exerciseSteps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: '#e5f7f5',
                      color: '#00A896',
                    }}
                  >
                    {index + 1}
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Feedback Boxes */}
          <div>
            <h3 className="text-2xl mb-4 font-semibold" style={{ color: '#002B49' }}>
              Feedback en Tiempo Real
            </h3>

            {/* Current Feedback */}
            <div
              className="rounded-2xl p-5 border-2 mb-4"
              style={{
                backgroundColor: feedbackState === 'perfect' ? '#f0fdf4' : feedbackState === 'improve' ? '#fef9e7' : '#fef2f2',
                borderColor: feedbackState === 'perfect' ? '#28A745' : feedbackState === 'improve' ? '#FFC107' : '#FF4D4D'
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-3 h-3 rounded-full animate-pulse mt-2"
                  style={{
                    backgroundColor: feedbackState === 'perfect' ? '#28A745' : feedbackState === 'improve' ? '#FFC107' : '#FF4D4D'
                  }}
                />
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide mb-2 font-semibold" style={{
                    color: feedbackState === 'perfect' ? '#28A745' : feedbackState === 'improve' ? '#FFC107' : '#FF4D4D'
                  }}>
                    {feedbackState === 'perfect' ? 'CORRECTO' : feedbackState === 'improve' ? 'MEJORAR' : 'INCORRECTO'}
                  </p>
                  <p className="text-sm" style={{ color: '#002B49' }}>
                    {currentFeedback}
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback Legend */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#28A745' }} />
                <span className="text-sm font-medium" style={{ color: '#002B49' }}>Postura Perfecta</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#fef9e7' }}>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FFC107' }} />
                <span className="text-sm font-medium" style={{ color: '#002B49' }}>Necesita Mejorar</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#fef2f2' }}>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF4D4D' }} />
                <span className="text-sm font-medium" style={{ color: '#002B49' }}>Postura Incorrecta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
