import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logoImage from '../../imports/Sin_título-1.png';

export function PatientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #002B49 0%, #003d5c 100%)'
      }}
    >
      {/* Decorative blurred circles */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: '#00A896' }}
      />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: '#00A896' }}
      />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo and title above card */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={logoImage} alt="Kinova Logo" className="w-16 h-16" />
            <h1 className="text-5xl font-bold text-white">Kinova</h1>
          </div>
          <p className="text-xl text-white/80">Acceso Paciente</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(0, 168, 150, 0.1)' }}
            >
              <Mail size={32} style={{ color: '#00A896' }} />
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#002B49' }}>
              Soy Paciente
            </h2>
            <p className="text-gray-500">
              Accede a tu plan de rehabilitación
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="paciente@email.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 transition-colors"
                  style={{ backgroundColor: '#f9fafb' }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 transition-colors"
                  style={{ backgroundColor: '#f9fafb' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#00A896' }}
            >
              Iniciar sesión
            </button>
          </form>
        </div>

        {/* Trust badge below card */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28A745' }} />
            <span className="text-white font-semibold text-xs tracking-wider">
              SEGURO Y CONFIABLE
            </span>
          </div>
          <p className="text-white/70 text-sm">
            Tus datos están protegidos con encriptación de nivel médico
          </p>
        </div>
      </div>
    </div>
  );
}
