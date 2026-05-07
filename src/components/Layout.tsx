import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Menu } from 'lucide-react';
import logoImage from '../imports/Sin_titulo-1.png';
import { Sidebar } from './Sidebar';
import { useTheme } from '../context/ThemeContext';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Carlos');
  const navigate = useNavigate();
  const { colors, theme } = useTheme();

  const handleLogout = () => {
    setUserName('');
    setIsSidebarOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: colors.background }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        userName={userName}
      />

      {/* Main Container */}
      <div className="max-w-md lg:max-w-4xl xl:max-w-6xl mx-auto min-h-screen shadow-lg" style={{ backgroundColor: colors.surface }}>
        {/* Header */}
        <header className="flex items-center justify-between px-6 lg:px-8 py-5 border-b" style={{ borderColor: colors.border }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }}
          >
            <Menu size={28} style={{ color: colors.primaryText }} />
          </button>

          <div className="flex items-center gap-3">
            <h1 className="font-semibold tracking-tight text-lg lg:text-xl" style={{ color: colors.primaryText }}>
              Kinova
            </h1>
            <img src={logoImage} alt="Kinova Logo" className="w-10 h-10 lg:w-12 lg:h-12" />
          </div>
        </header>

        {/* Content */}
        <Outlet />
      </div>
    </div>
  );
}
