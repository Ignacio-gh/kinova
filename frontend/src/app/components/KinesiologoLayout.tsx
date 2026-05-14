import { Outlet } from 'react-router';
import { KinesiologoSidebar } from './KinesiologoSidebar';
import { useTheme } from '../context/ThemeContext';

export function KinesiologoLayout() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <KinesiologoSidebar />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen" style={{ backgroundColor: colors.background }}>
        <Outlet />
      </div>
    </div>
  );
}
