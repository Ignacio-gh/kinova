import { useState } from 'react';
import { Outlet } from 'react-router';
import { SideNav } from './SideNav';
import { useTheme } from '../context/ThemeContext';

export function DesktopLayout() {
  const [userName, setUserName] = useState('Carlos');
  const { colors } = useTheme();

  const handleLogout = () => {
    setUserName('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <SideNav onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen" style={{ backgroundColor: colors.background }}>
        <Outlet />
      </div>
    </div>
  );
}
