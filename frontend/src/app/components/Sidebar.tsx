import { X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  userName: string;
}

export function Sidebar({ isOpen, onClose, onLogout, onNavigate, userName }: SidebarProps) {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] lg:w-[320px] shadow-2xl z-50 transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: colors.surface }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.border }}>
            <h2 className="font-semibold" style={{ color: colors.primaryText }}>Menú</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }}
            >
              <X size={24} style={{ color: colors.primaryText }} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => onNavigate('/')}
              className="w-full text-left px-6 py-4 rounded-xl transition-all"
              style={{
                color: colors.primaryText,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              INICIO
            </button>
            <button
              onClick={() => onNavigate('/mi-rutina')}
              className="w-full text-left px-6 py-4 rounded-xl transition-all"
              style={{
                color: colors.primaryText,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Mi Rutina
            </button>
            <button
              onClick={() => onNavigate('/ejercicios')}
              className="w-full text-left px-6 py-4 rounded-xl transition-all"
              style={{
                color: colors.primaryText,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Ejercicios
            </button>

            {/* Dark Mode Toggle */}
            <div className="pt-4">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all"
                style={{
                  color: colors.primaryText,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>Tema Oscuro</span>
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Moon size={20} style={{ color: colors.turquoise }} />
                  ) : (
                    <Sun size={20} style={{ color: colors.turquoise }} />
                  )}
                </div>
              </button>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t" style={{ borderColor: colors.border }}>
            <button
              onClick={onLogout}
              className="w-full px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
              style={{
                backgroundColor: '#00A896',
                color: '#ffffff'
              }}
            >
              {userName ? 'Log Out' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
