import { Activity, Shield, Zap } from 'lucide-react';
import logoImage from '../../imports/Sin_título-1.png';

export function Welcome() {

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #002B49 0%, #003d5c 100%)'
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#00A896' }} />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] rounded-full opacity-10" style={{ backgroundColor: '#00A896' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: '#00A896' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Logo and Hero */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img src={logoImage} alt="Kinova Logo" className="w-32 h-32" />
          </div>
          <h1 className="text-7xl font-bold mb-4 text-white">
            Kinova
          </h1>
          <p className="text-2xl mb-2" style={{ color: '#00A896' }}>
            Asistente de Rehabilitación Biomecánica
          </p>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Recupera tu movilidad con tecnología de vanguardia y seguimiento inteligente
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-8 mb-16 max-w-5xl">
          <div className="text-center p-6 rounded-2xl backdrop-blur-sm bg-white/10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#00A896' }}>
              <Activity size={32} color="#ffffff" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Análisis en Tiempo Real
            </h3>
            <p className="text-white/70">
              IA avanzada para monitoreo de postura
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl backdrop-blur-sm bg-white/10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#00A896' }}>
              <Zap size={32} color="#ffffff" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Planes Personalizados
            </h3>
            <p className="text-white/70">
              Rutinas adaptadas a tu progreso
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl backdrop-blur-sm bg-white/10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#00A896' }}>
              <Shield size={32} color="#ffffff" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Datos Seguros
            </h3>
            <p className="text-white/70">
              Encriptación de nivel médico
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-white/60 text-sm">
            Desarrollado por profesionales de la salud • Avalado por especialistas en rehabilitación
          </p>
        </div>
      </div>
    </div>
  );
}
