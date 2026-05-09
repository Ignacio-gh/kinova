import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { Activity, TrendingUp } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const userName = 'Carlos';
  const { colors } = useTheme();

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-8">
        <h2
          className="text-5xl mb-2"
          style={{
            fontFamily: 'Playball, cursive',
            color: colors.primaryText
          }}
        >
          Bienvenido, {userName || 'Invitado'}
        </h2>
        <p className="text-lg" style={{ color: colors.secondaryText }}>
          Panel de Rehabilitación
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Today's Exercise Card */}
        <div
          className="col-span-2 relative overflow-hidden rounded-3xl p-10 shadow-lg transition-all hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #002B49 0%, #003d5c 100%)'
          }}
        >
          <div
            className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20"
            style={{ backgroundColor: '#00A896' }}
          />
          <div
            className="absolute bottom-4 left-4 w-4 h-4 rounded-full"
            style={{ backgroundColor: '#00A896' }}
          />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-gray-300 uppercase tracking-wider">
              <Activity size={20} />
              <span>Ejercicio del Día - Lunes</span>
            </div>
            <div>
              <h3
                className="text-4xl tracking-tight mb-3"
                style={{
                  color: '#00A896',
                  fontWeight: '700'
                }}
              >
                Sentadilla Búlgara
              </h3>
              <p
                className="text-6xl mb-4"
                style={{
                  color: '#00A896',
                  fontWeight: '700'
                }}
              >
                x20
              </p>
              <p className="text-gray-300 text-lg mb-2">3 series • Rodilla</p>
            </div>
            <button
              onClick={() => navigate('/sesion/1')}
              className="px-8 py-4 rounded-xl transition-all hover:shadow-md text-lg font-semibold"
              style={{
                backgroundColor: '#00A896',
                color: '#ffffff'
              }}
            >
              Iniciar Ejercicio
            </button>
          </div>
        </div>

        {/* Progress Card */}
        <div className="rounded-2xl p-6 hover:shadow-lg border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}>
              <TrendingUp size={24} style={{ color: '#00A896' }} />
            </div>
            <h3 className="font-semibold text-lg" style={{ color: colors.primaryText }}>
              Progreso Semanal
            </h3>
          </div>
          <p className="text-5xl font-bold mb-2" style={{ color: colors.primaryText }}>
            4<span className="text-2xl" style={{ color: colors.secondaryText }}>/7</span>
          </p>
          <p className="text-sm" style={{ color: colors.secondaryText }}>
            Días completados esta semana
          </p>
          <div className="mt-4 h-2 rounded-full" style={{ backgroundColor: colors.border }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ backgroundColor: '#00A896', width: '57%' }}
            />
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/mi-rutina')}
          className="rounded-2xl p-6 text-left transition-all hover:shadow-lg border"
          style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
        >
          <h4 className="text-xl font-semibold mb-2" style={{ color: colors.primaryText }}>
            Mi Rutina
          </h4>
          <p className="text-sm" style={{ color: colors.secondaryText }}>
            Gestiona tus ejercicios semanales
          </p>
        </button>

        <button
          onClick={() => navigate('/ejercicios')}
          className="rounded-2xl p-6 text-left transition-all hover:shadow-lg border"
          style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
        >
          <h4 className="text-xl font-semibold mb-2" style={{ color: colors.primaryText }}>
            Biblioteca
          </h4>
          <p className="text-sm" style={{ color: colors.secondaryText }}>
            Explora ejercicios para piernas
          </p>
        </button>

        <div
          className="rounded-2xl p-6 border hover:shadow-lg"
          style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
        >
          <h4 className="text-xl font-semibold mb-2" style={{ color: colors.primaryText }}>
            Zonas de Enfoque
          </h4>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <span style={{ color: colors.secondaryText }}>Rodilla</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#00A896', color: '#ffffff' }}>
                5
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.secondaryText }}>Tobillo</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#00A896', color: '#ffffff' }}>
                2
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.secondaryText }}>Muslo</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#00A896', color: '#ffffff' }}>
                3
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
