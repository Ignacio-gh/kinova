import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logoImage from '../../imports/Sin_título-1.png';

export function Login() {
  // Patient form state
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [showPatientPassword, setShowPatientPassword] = useState(false);

  // Kinesiologist form state
  const [kinesiologoEmail, setKinesiologoEmail] = useState('');
  const [kinesiologoPassword, setKinesiologoPassword] = useState('');
  const [showKinesiologoPassword, setShowKinesiologoPassword] = useState(false);

  const navigate = useNavigate();

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual patient login logic
    navigate('/app');
  };

  const handleKinesiologoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual kinesiologist login logic
    navigate('/app');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #002B49 0%, #003d5c 100%)'
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#00A896' }} />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#00A896' }} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 transition-colors hover:opacity-70"
          style={{ color: '#ffffff' }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Volver al inicio</span>
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="Kinova Logo" className="w-24 h-24" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">
            Kinova
          </h1>
          <p className="text-xl text-white/80">
            Selecciona tu tipo de acceso
          </p>
        </div>

        {/* Two Login Cards */}
        <div className="grid grid-cols-2 gap-8">
          {/* Patient Login Card */}
          <div
            className="rounded-3xl shadow-2xl p-10"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}>
                <Mail size={32} style={{ color: '#00A896' }} />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: '#002B49' }}>
                Soy Paciente
              </h2>
              <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
                Accede a tu plan de rehabilitación
              </p>
            </div>

            <form onSubmit={handlePatientLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="patient-email"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#002B49' }}
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: '#9ca3af' }}
                  />
                  <input
                    id="patient-email"
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="paciente@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: '#e5e7eb',
                      '--tw-ring-color': '#00A896',
                      color: '#002B49'
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="patient-password"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#002B49' }}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: '#9ca3af' }}
                  />
                  <input
                    id="patient-password"
                    type={showPatientPassword ? 'text' : 'password'}
                    value={patientPassword}
                    onChange={(e) => setPatientPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: '#e5e7eb',
                      '--tw-ring-color': '#00A896',
                      color: '#002B49'
                    } as React.CSSProperties}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPatientPassword(!showPatientPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1"
                  >
                    {showPatientPassword ? (
                      <EyeOff size={18} style={{ color: '#9ca3af' }} />
                    ) : (
                      <Eye size={18} style={{ color: '#9ca3af' }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
                style={{
                  backgroundColor: '#00A896',
                  color: '#ffffff'
                }}
              >
                Iniciar sesión
              </button>
            </form>
          </div>

          {/* Kinesiologist Login Card */}
          <div
            className="rounded-3xl shadow-2xl p-10"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(0, 43, 73, 0.1)' }}>
                <Lock size={32} style={{ color: '#002B49' }} />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: '#002B49' }}>
                Soy Kinesiólogo
              </h2>
              <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
                Portal profesional
              </p>
            </div>

            <form onSubmit={handleKinesiologoLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="kinesiologo-email"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#002B49' }}
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: '#9ca3af' }}
                  />
                  <input
                    id="kinesiologo-email"
                    type="email"
                    value={kinesiologoEmail}
                    onChange={(e) => setKinesiologoEmail(e.target.value)}
                    placeholder="kinesiologo@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: '#e5e7eb',
                      '--tw-ring-color': '#00A896',
                      color: '#002B49'
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="kinesiologo-password"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#002B49' }}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: '#9ca3af' }}
                  />
                  <input
                    id="kinesiologo-password"
                    type={showKinesiologoPassword ? 'text' : 'password'}
                    value={kinesiologoPassword}
                    onChange={(e) => setKinesiologoPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: '#e5e7eb',
                      '--tw-ring-color': '#00A896',
                      color: '#002B49'
                    } as React.CSSProperties}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKinesiologoPassword(!showKinesiologoPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1"
                  >
                    {showKinesiologoPassword ? (
                      <EyeOff size={18} style={{ color: '#9ca3af' }} />
                    ) : (
                      <Eye size={18} style={{ color: '#9ca3af' }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
                style={{
                  backgroundColor: '#00A896',
                  color: '#ffffff'
                }}
              >
                Iniciar sesión
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  ¿No tenés cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/registro?type=kinesiologo')}
                    className="font-semibold hover:underline"
                    style={{ color: '#00A896' }}
                  >
                    Registrate
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28A745' }} />
            <p className="text-xs font-semibold" style={{ color: '#ffffff' }}>
              SEGURO Y CONFIABLE
            </p>
          </div>
          <p className="text-xs text-white/70">
            Tus datos están protegidos con encriptación de nivel médico
          </p>
        </div>
      </div>
    </div>
  );
}
