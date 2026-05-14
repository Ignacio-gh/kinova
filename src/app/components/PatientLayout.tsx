import { Outlet } from 'react-router';
import { PatientSidebar } from './PatientSidebar';
import { useTheme } from '../context/ThemeContext';

export function PatientLayout() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <PatientSidebar />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen" style={{ backgroundColor: colors.background }}>
        <Outlet />
      </div>
    </div>
  );
}
