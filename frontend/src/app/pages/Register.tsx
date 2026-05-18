import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Upload, FileCheck, ShieldAlert } from 'lucide-react';
import logoImage from '../../imports/Sin_título-1.png';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // --- Estado para el archivo de verificación profesional ---
  const [verificationFile, setVerificationFile] = useState<File | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userType = searchParams.get('type') || 'paciente';
  const isKinesiologo = userType === 'kinesiologo';


  // Manejador de la carga del archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVerificationFile(e.target.files[0]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  if (isKinesiologo && !verificationFile) {
    alert('Por favor, adjunte su credencial o título para verificar su cuenta profesional.');
    return;
  }

  // --- REDIRECCIÓN INTELIGENTE SEGÚN EL ROL ---
  if (isKinesiologo) {
    // Si es kinesiólogo, lo mandamos directo a su listado de pacientes
    navigate('/login/kinesiologo'); 
  }}

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8 relative"
      style={{
        background: 'linear-gradient(135deg, #002B49 0%, #003d5c 100%)'
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#00A896' }} />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#00A896' }} />

      {/* Register Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl shadow-2xl p-10 my-8"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Back to Home */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 transition-colors hover:opacity-70"
          style={{ color: '#6b7280' }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Volver al inicio</span>
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="Kinova Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#002B49' }}>
            Crear Cuenta
          </h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            {isKinesiologo ? 'Únete como profesional verificado' : 'Comienza tu rehabilitación hoy'}
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-1.5" style={{ color: '#002B49' }}>
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: '#9ca3af' }} />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#e5e7eb', '--tw-ring-color': '#00A896', color: '#002B49' } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1.5" style={{ color: '#002B49' }}>
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: '#9ca3af' }} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#e5e7eb', '--tw-ring-color': '#00A896', color: '#002B49' } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1.5" style={{ color: '#002B49' }}>
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: '#9ca3af' }} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#e5e7eb', '--tw-ring-color': '#00A896', color: '#002B49' } as React.CSSProperties}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1"
              >
                {showPassword ? <EyeOff size={20} style={{ color: '#9ca3af' }} /> : <Eye size={20} style={{ color: '#9ca3af' }} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1.5" style={{ color: '#002B49' }}>
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: '#9ca3af' }} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#e5e7eb', '--tw-ring-color': '#00A896', color: '#002B49' } as React.CSSProperties}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1"
              >
                {showConfirmPassword ? <EyeOff size={20} style={{ color: '#9ca3af' }} /> : <Eye size={20} style={{ color: '#9ca3af' }} />}
              </button>
            </div>
          </div>

          {/* --- RECTÁNGULO ADJUNTAR ARCHIVO (DESPLEGABLE CONDICIONAL) --- */}
          {isKinesiologo && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-3 duration-200">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#002B49' }}>
                Verificación Matrícula Profesional *
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50/50 text-center relative hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />
                
                <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                  {verificationFile ? (
                    <>
                      <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                        <FileCheck size={24} />
                      </div>
                      <p className="text-xs font-bold text-emerald-700 truncate max-w-[280px]">
                        {verificationFile.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Haga clic para reemplazar el archivo
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="p-2 bg-gray-100 rounded-xl text-gray-500">
                        <Upload size={20} />
                      </div>
                      <p className="text-xs font-semibold text-[#002B49]">
                        Adjunte su Título o Matrícula Nacional
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Formatos permitidos: PDF, PNG o JPG (Máx. 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-1.5 mt-2 opacity-70">
                <ShieldAlert size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-500 leading-tight">
                  Su documentación será analizada por el comité médico de Kinova antes de habilitar su acceso al panel.
                </p>
              </div>
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold text-lg mt-2"
            style={{
              backgroundColor: '#00A896',
              color: '#ffffff'
            }}
          >
            Registrarse
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
          <span className="px-4 text-sm" style={{ color: '#9ca3af' }}>o</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm" style={{ color: '#6b7280' }}>
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login/kinesiologo')}
              className="font-semibold hover:underline"
              style={{ color: '#00A896' }}
            >
              Iniciar sesión
            </button>
          </p>
        </div>

        {/* Terms */}
        <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: '#e5e7eb' }}>
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            Al registrarte, aceptas nuestros{' '}
            <button className="hover:underline" style={{ color: '#00A896' }}>
              Términos de Servicio
            </button>
            {' '}y{' '}
            <button className="hover:underline" style={{ color: '#00A896' }}>
              Política de Privacidad
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
