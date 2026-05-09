import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logoImage from '../../imports/Sin_título-1.png';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    navigate('/');
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

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl shadow-2xl p-10"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="Kinova Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#002B49' }}>
            Kinova
          </h1>
          <p className="text-lg" style={{ color: '#6b7280' }}>
            Asistente de Rehabilitación Biomecánica
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2"
              style={{ color: '#002B49' }}
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                size={20}
                style={{ color: '#9ca3af' }}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
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
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
              style={{ color: '#002B49' }}
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                size={20}
                style={{ color: '#9ca3af' }}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: '#e5e7eb',
                  '--tw-ring-color': '#00A896',
                  color: '#002B49'
                } as React.CSSProperties}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1"
              >
                {showPassword ? (
                  <EyeOff size={20} style={{ color: '#9ca3af' }} />
                ) : (
                  <Eye size={20} style={{ color: '#9ca3af' }} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm font-semibold hover:underline"
              style={{ color: '#00A896' }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            style={{
              backgroundColor: '#00A896',
              color: '#ffffff'
            }}
          >
            Iniciar sesión
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
          <span className="px-4 text-sm" style={{ color: '#9ca3af' }}>
            o
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm" style={{ color: '#6b7280' }}>
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => navigate('/registro')}
              className="font-semibold hover:underline"
              style={{ color: '#00A896' }}
            >
              Registrarse
            </button>
          </p>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28A745' }} />
            <p className="text-xs font-semibold" style={{ color: '#28A745' }}>
              SEGURO Y CONFIABLE
            </p>
          </div>
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            Tus datos están protegidos con encriptación de nivel médico
          </p>
        </div>
      </div>
    </div>
  );
}
