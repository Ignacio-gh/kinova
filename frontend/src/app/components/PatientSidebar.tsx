import { Calendar, History, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import logoImage from '../../imports/Sin_título-1.png';

export function PatientSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, colors } = useTheme();

  const navItems = [
    { path: '/paciente/calendario', icon: Calendar, label: 'Mi Calendario' },
    { path: '/paciente/historial', icon: History, label: 'Historial de Sesiones' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div
      className="fixed left-0 top-0 h-screen w-64 border-r flex flex-col"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: colors.border }}>
        <button
          onClick={() => navigate('/paciente/calendario')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src={logoImage} alt="Kinova Logo" className="w-12 h-12" />
          <div className="text-left">
            <h1 className="text-xl font-bold" style={{ color: colors.primaryText }}>
              Kinova
            </h1>
            <p className="text-xs" style={{ color: colors.secondaryText }}>
              Portal Paciente
            </p>
          </div>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: active ? '#00A896' : 'transparent',
                color: active ? '#ffffff' : colors.primaryText
              }}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{ color: colors.primaryText }}
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          <span className="font-medium">Tema Oscuro</span>
        </button>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t" style={{ borderColor: colors.border }}>
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{
            backgroundColor: '#FF4D4D',
            color: '#ffffff'
          }}
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
