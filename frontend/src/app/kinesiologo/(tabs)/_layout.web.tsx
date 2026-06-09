import { Slot } from 'expo-router';
import { PatientsProvider } from '@/context/PatientsContext';

export default function KinesiologoTabsLayoutWeb() {
  return (
    <PatientsProvider>
      <Slot />
    </PatientsProvider>
  );
}
