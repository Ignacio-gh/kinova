import { Home, Calendar, Dumbbell, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import logoImage from '../../imports/Sin_título-1.png';

interface SideNavProps {
  onLogout?: () => void;
}

export function SideNav({ onLogout }: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, colors } = useTheme();

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/mi-rutina', icon: Calendar, label: 'Mi Rutina' },
    { path: '/ejercicios', icon: Dumbbell, label: 'Ejercicios' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

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
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="Recova Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold" style={{ color: colors.primaryText }}>
            Recova
          </h1>
        </div>
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
          onClick={() => {
            if (onLogout) onLogout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{
            backgroundColor: '#FF4D4D',
            color: '#ffffff'
          }}
        >
          <LogOut size={20} />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}
