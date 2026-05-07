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
    <div className="fixed inset-0 bg-black">
      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 lg:top-8 right-6 lg:right-8 z-50 p-3 lg:p-4 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
      >
        <X size={24} className="lg:w-7 lg:h-7" color="#ffffff" />
      </button>

      {/* Rep Counter */}
      <div className="absolute top-6 lg:top-8 left-6 lg:left-8 z-50 px-5 lg:px-7 py-3 lg:py-4 bg-black/50 backdrop-blur-sm rounded-2xl">
        <p className="text-white text-sm lg:text-base mb-1">Repeticiones</p>
        <p className="text-white text-3xl lg:text-5xl font-bold">{reps}</p>
      </div>

      {/* Camera View with AR Overlay */}
      <div className="relative w-full h-[60vh] lg:h-[70vh] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
        {/* Simulated camera background */}
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-purple-900/30" />
        </div>

        {/* AR Pose Estimation Overlay */}
        <div className="relative z-10">
          {/* Simulated body skeleton with joint dots */}
          <svg width="300" height="400" viewBox="0 0 300 400" className="drop-shadow-2xl w-[300px] lg:w-[400px] h-auto">
            {/* Connecting lines */}
            <line x1="150" y1="60" x2="150" y2="140" stroke="#00A896" strokeWidth="3" opacity="0.8" />
            <line x1="150" y1="140" x2="100" y2="200" stroke="#00A896" strokeWidth="3" opacity="0.8" />
            <line x1="150" y1="140" x2="200" y2="200" stroke="#00A896" strokeWidth="3" opacity="0.8" />
            <line x1="150" y1="140" x2="150" y2="240" stroke="#00A896" strokeWidth="3" opacity="0.8" />
            <line x1="150" y1="240" x2="120" y2="340" stroke="#00A896" strokeWidth="3" opacity="0.8" />
            <line x1="150" y1="240" x2="180" y2="340" stroke="#00A896" strokeWidth="3" opacity="0.8" />

            {/* Joint dots */}
            <circle cx="150" cy="60" r="8" fill="#00A896" className="animate-pulse" />
            <circle cx="150" cy="140" r="8" fill="#00A896" className="animate-pulse" />
            <circle cx="100" cy="200" r="8" fill="#00A896" className="animate-pulse" />
            <circle cx="200" cy="200" r="8" fill="#00A896" className="animate-pulse" />
            <circle cx="150" cy="240" r="8" fill="#00A896" className="animate-pulse" />
            <circle cx="120" cy="340" r="8" fill="#00A896" className="animate-pulse" />
            <circle cx="180" cy="340" r="8" fill="#00A896" className="animate-pulse" />

            {/* Outer glow rings */}
            <circle cx="150" cy="140" r="12" fill="none" stroke="#00A896" strokeWidth="2" opacity="0.4" />
            <circle cx="150" cy="240" r="12" fill="none" stroke="#00A896" strokeWidth="2" opacity="0.4" />
          </svg>
        </div>

        {/* Pause/Play Button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 p-5 lg:p-7 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
        >
          {isPaused ? (
            <Play size={32} className="lg:w-12 lg:h-12" color="#ffffff" fill="#ffffff" />
          ) : (
            <Pause size={32} className="lg:w-12 lg:h-12" color="#ffffff" fill="#ffffff" />
          )}
        </button>
      </div>

      {/* Feedback Bar */}
      <div
        className="w-full py-4 lg:py-6 transition-all duration-500"
        style={{ backgroundColor: config.bg }}
      >
        <div className="flex items-center justify-center gap-3 lg:gap-4">
          <span className="text-2xl lg:text-3xl">{config.icon}</span>
          <p className="text-white text-xl lg:text-2xl font-semibold">{config.text}</p>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-2xl max-h-[35vh] lg:max-h-[25vh] overflow-hidden">
        <div className="px-6 lg:px-8 py-5 lg:py-6 max-w-4xl mx-auto">
          <h3 className="text-xl lg:text-2xl mb-4 lg:mb-5" style={{ color: '#002B49', fontWeight: '600' }}>
            Pasos a seguir
          </h3>

          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Scrollable Steps */}
            <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-0 max-h-32 lg:max-h-40 overflow-y-auto">
              {exerciseSteps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-xs lg:text-sm"
                    style={{
                      backgroundColor: '#e5f7f5',
                      color: '#00A896',
                      fontWeight: '600'
                    }}
                  >
                    {index + 1}
                  </span>
                  <p className="text-gray-700 text-sm lg:text-base leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {/* AI Feedback Box */}
            <div
              className="rounded-2xl p-4 lg:p-5 border-2"
              style={{
                backgroundColor: '#f0f9ff',
                borderColor: '#00A896'
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-500 animate-pulse mt-2" />
                <div>
                  <p className="text-xs lg:text-sm uppercase tracking-wide mb-1 lg:mb-2" style={{ color: '#00A896', fontWeight: '600' }}>
                    AI Feedback en Vivo
                  </p>
                  <p className="text-sm lg:text-base" style={{ color: '#002B49' }}>
                    {currentFeedback}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
