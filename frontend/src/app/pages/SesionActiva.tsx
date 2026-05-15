import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { X, Pause, Play } from 'lucide-react';

type FeedbackState = 'perfect' | 'improve' | 'bad';
type CameraStatus = 'idle' | 'starting' | 'streaming' | 'error';

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

  // ---------- estado de la cámara ----------
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Abre la webcam del navegador con getUserMedia.
  const startCamera = async () => {
    setCameraStatus('starting');
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {
          /* el play() puede rechazar si la pestaña pierde foco — lo ignoramos */
        });
      }
      setCameraStatus('streaming');
    } catch (err) {
      const message =
        err instanceof Error
          ? mapCameraError(err)
          : 'No se pudo acceder a la cámara.';
      setCameraError(message);
      setCameraStatus('error');
    }
  };

  // Cierra todos los tracks del stream y libera la cámara.
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {/* Camera View */}
        <div className="flex-1 relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
          {/* Video real de la webcam — siempre montado para que srcObject funcione */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              cameraStatus === 'streaming' ? 'opacity-100' : 'opacity-0'
            }`}
            // Espejado tipo "selfie": más natural haciendo ejercicio frente a la pantalla.
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Estado: cargando */}
          {cameraStatus === 'starting' && (
            <div className="relative text-center">
              <div className="inline-block w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
              <p className="text-white/80 text-xl font-medium">Abriendo cámara…</p>
            </div>
          )}

          {/* Estado: error / permiso denegado */}
          {cameraStatus === 'error' && (
            <div className="relative text-center max-w-md px-6">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠</span>
              </div>
              <p className="text-white text-xl font-semibold mb-2">No se pudo abrir la cámara</p>
              <p className="text-white/60 text-sm mb-6">
                {cameraError ?? 'Permití el acceso a la cámara y volvé a intentar.'}
              </p>
              <button
                onClick={startCamera}
                className="px-6 py-3 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: '#00A896', color: '#ffffff' }}
              >
                Reintentar
              </button>
            </div>
          )}

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

// Mensajes amigables para los errores típicos de getUserMedia.
function mapCameraError(err: Error): string {
  switch (err.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Permiso denegado. Habilitá la cámara para este sitio en la configuración del navegador.';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'No se encontró ninguna cámara conectada.';
    case 'NotReadableError':
      return 'La cámara está siendo usada por otra aplicación (Zoom, Meet, Teams, etc.).';
    case 'AbortError':
      return 'La cámara se interrumpió. Volvé a intentar.';
    default:
      return err.message || 'No se pudo acceder a la cámara.';
  }
}
