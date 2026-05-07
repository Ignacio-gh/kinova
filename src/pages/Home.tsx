import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';

export function Home() {
  const navigate = useNavigate();
  const userName = 'Carlos';
  const { colors } = useTheme();

  return (
    <main className="px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {/* Welcome Message */}
      <div className="text-center">
        <h2
          className="text-4xl lg:text-6xl xl:text-7xl"
          style={{
            fontFamily: 'Playball, cursive',
            color: colors.primaryText
          }}
        >
          Bienvenido, {userName || 'Invitado'}
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Exercise Card */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 lg:p-10 shadow-lg transition-all hover:shadow-xl lg:col-span-2"
          style={{
            background: 'linear-gradient(135deg, #002B49 0%, #003d5c 100%)'
          }}
        >
          {/* Decorative circles inspired by the logo */}
          <div
            className="absolute -top-6 -right-6 w-24 h-24 lg:w-32 lg:h-32 rounded-full opacity-20"
            style={{ backgroundColor: '#00A896' }}
          />
          <div
            className="absolute bottom-4 left-4 w-3 h-3 lg:w-4 lg:h-4 rounded-full"
            style={{ backgroundColor: '#00A896' }}
          />
          <div
            className="absolute top-12 left-8 w-2 h-2 lg:w-3 lg:h-3 rounded-full"
            style={{ backgroundColor: '#00A896' }}
          />

          <div className="relative z-10 space-y-4 lg:space-y-6">
            <p className="text-gray-300 uppercase tracking-wider text-sm lg:text-base">
              Lunes
            </p>
            <div>
              <h3
                className="text-3xl lg:text-5xl tracking-tight mb-2"
                style={{
                  color: '#00A896',
                  fontWeight: '700'
                }}
              >
                Sentadilla Búlgara
              </h3>
              <p
                className="text-5xl lg:text-7xl"
                style={{
                  color: '#00A896',
                  fontWeight: '700'
                }}
              >
                x20
              </p>
            </div>
            <button
              onClick={() => navigate('/sesion/1')}
              className="mt-6 w-full lg:w-auto lg:px-12 py-3 lg:py-4 px-6 rounded-xl transition-all hover:shadow-md text-base lg:text-lg"
              style={{
                backgroundColor: '#00A896',
                color: '#ffffff'
              }}
            >
              Iniciar Ejercicio
            </button>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="rounded-2xl p-5 lg:p-7 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p className="text-sm lg:text-base mb-2" style={{ color: colors.secondaryText }}>Progreso Semanal</p>
          <p className="text-2xl lg:text-4xl" style={{ color: colors.primaryText, fontWeight: '700' }}>
            4/7
          </p>
        </div>
        <div className="rounded-2xl p-5 lg:p-7 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p className="text-sm lg:text-base mb-2" style={{ color: colors.secondaryText }}>Racha</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl lg:text-4xl" style={{ color: '#00A896', fontWeight: '700' }}>
              12
            </p>
            <span className="text-2xl lg:text-3xl" style={{ color: '#00A896' }}>🔥</span>
          </div>
        </div>
      </div>
    </main>
  );
}
