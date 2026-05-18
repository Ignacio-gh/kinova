import { useNavigate } from 'react-router';
import { Activity, Eye, UserCheck, Stethoscope, Users, TrendingUp, ArrowRight } from 'lucide-react';
import logoImage from '../../imports/Sin_título-1.png';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Navigation Bar */}
      <nav className="border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src={logoImage} alt="Kinova Logo" className="w-12 h-12" />
            <span className="text-2xl font-bold" style={{ color: '#002B49' }}>
              Kinova
            </span>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login/paciente')}
              className="px-6 py-3 rounded-xl transition-all hover:shadow-md font-semibold border-2"
              style={{
                borderColor: '#00A896',
                color: '#00A896',
                backgroundColor: 'transparent'
              }}
            >
              Soy Paciente
            </button>
            <button
              onClick={() => navigate('/login/kinesiologo')}
              className="px-6 py-3 rounded-xl transition-all hover:shadow-md font-semibold"
              style={{
                backgroundColor: '#00A896',
                color: '#ffffff'
              }}
            >
              Soy Kinesiólogo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #002B49 0%, #003d5c 100%)'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#00A896' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10" style={{ backgroundColor: '#00A896' }} />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="px-4 py-2 rounded-full backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 168, 150, 0.2)' }}>
                <span className="text-sm font-semibold" style={{ color: '#00A896' }}>
                  Rehabilitación con Inteligencia Artificial
                </span>
              </div>
            </div>

            <h1 className="text-6xl font-bold mb-6 text-white leading-tight">
              Tu kinesiólogo virtual que guía tu rehabilitación con IA
            </h1>

            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Kinova utiliza visión por computadora e inteligencia artificial para monitorear tus ejercicios de rehabilitación en tiempo real,
              asegurando que cada movimiento sea correcto y efectivo.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              <div>
                <p className="text-4xl font-bold mb-1" style={{ color: '#00A896' }}>98%</p>
                <p className="text-white/70">Precisión en análisis</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1" style={{ color: '#00A896' }}>24/7</p>
                <p className="text-white/70">Disponibilidad</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1" style={{ color: '#00A896' }}>1000+</p>
                <p className="text-white/70">Pacientes activos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section className="py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4" style={{ color: '#002B49' }}>
              ¿Cómo funciona Kinova?
            </h2>
            <p className="text-xl" style={{ color: '#6b7280' }}>
              Un proceso simple en tres pasos para tu recuperación
            </p>
          </div>

          <div className="grid grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  style={{ backgroundColor: '#002B49' }}
                >
                  <Stethoscope size={48} color="#00A896" />
                </div>
                <div
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl"
                  style={{ backgroundColor: '#00A896', color: '#ffffff' }}
                >
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#002B49' }}>
                El kinesiólogo asigna ejercicios
              </h3>
              <p className="text-lg" style={{ color: '#6b7280' }}>
                Tu profesional de la salud crea un plan personalizado de ejercicios adaptado a tu condición y objetivos de rehabilitación.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  style={{ backgroundColor: '#002B49' }}
                >
                  <Users size={48} color="#00A896" />
                </div>
                <div
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl"
                  style={{ backgroundColor: '#00A896', color: '#ffffff' }}
                >
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#002B49' }}>
                Realizas los ejercicios en casa
              </h3>
              <p className="text-lg" style={{ color: '#6b7280' }}>
                Desde la comodidad de tu hogar, sigues tu rutina de rehabilitación con instrucciones claras paso a paso.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  style={{ backgroundColor: '#002B49' }}
                >
                  <Eye size={48} color="#00A896" />
                </div>
                <div
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl"
                  style={{ backgroundColor: '#00A896', color: '#ffffff' }}
                >
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#002B49' }}>
                La IA monitorea tu postura en tiempo real
              </h3>
              <p className="text-lg" style={{ color: '#6b7280' }}>
                Nuestra tecnología de visión por computadora analiza cada movimiento y te da feedback instantáneo para garantizar la correcta ejecución.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para Quién Es Section */}
      <section className="py-20" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4" style={{ color: '#002B49' }}>
              ¿Para quién es Kinova?
            </h2>
            <p className="text-xl" style={{ color: '#6b7280' }}>
              Una solución integral para pacientes y profesionales
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12">
            {/* Para Pacientes */}
            <div
              className="rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all border-2"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
              >
                <Activity size={40} style={{ color: '#00A896' }} />
              </div>

              <h3 className="text-3xl font-bold mb-4" style={{ color: '#002B49' }}>
                Para Pacientes
              </h3>

              <p className="text-lg mb-6" style={{ color: '#6b7280' }}>
                Recupera tu movilidad desde casa con la guía de inteligencia artificial
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#00A896' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span style={{ color: '#002B49' }}>Ejercicios personalizados según tu condición</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#00A896' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span style={{ color: '#002B49' }}>Feedback instantáneo sobre tu postura</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#00A896' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span style={{ color: '#002B49' }}>Seguimiento de tu progreso día a día</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#00A896' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span style={{ color: '#002B49' }}>Disponible 24/7 desde cualquier lugar</span>
                </li>
              </ul>
            </div>

            {/* Para Kinesiólogos */}
            <div
              className="rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all border-2"
              style={{ backgroundColor: '#002B49', borderColor: '#002B49' }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: 'rgba(0, 168, 150, 0.2)' }}
              >
                <UserCheck size={40} style={{ color: '#00A896' }} />
              </div>

              <h3 className="text-3xl font-bold mb-4 text-white">
                Para Kinesiólogos
              </h3>

              <p className="text-lg mb-6 text-white/80">
                Amplía tu alcance y mejora la adherencia al tratamiento de tus pacientes
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#00A896' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Asigna y personaliza rutinas de ejercicios</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#00A896' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Monitorea el progreso de múltiples pacientes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#00A896' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Recibe reportes detallados de adherencia</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#00A896' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white">Optimiza el tiempo de consulta presencial</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(135deg, #00A896 0%, #008f7f 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-5xl font-bold mb-6 text-white">
            Comienza tu recuperación hoy
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Únete a miles de pacientes que ya están mejorando su calidad de vida con Kinova
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImage} alt="Kinova Logo" className="w-10 h-10" />
                <span className="text-xl font-bold" style={{ color: '#002B49' }}>
                  Kinova
                </span>
              </div>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Rehabilitación biomecánica asistida por inteligencia artificial
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#002B49' }}>Producto</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#6b7280' }}>
                <li><button className="hover:underline">Características</button></li>
                <li><button className="hover:underline">Precios</button></li>
                <li><button className="hover:underline">Demo</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#002B49' }}>Recursos</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#6b7280' }}>
                <li><button className="hover:underline">Blog</button></li>
                <li><button className="hover:underline">Guías</button></li>
                <li><button className="hover:underline">Soporte</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#002B49' }}>Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#6b7280' }}>
                <li><button className="hover:underline">Privacidad</button></li>
                <li><button className="hover:underline">Términos</button></li>
                <li><button className="hover:underline">Cookies</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              © 2026 Kinova. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: '#00A896' }} />
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Desarrollado con tecnología médica avanzada
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
