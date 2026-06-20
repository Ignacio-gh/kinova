import { Slot } from 'expo-router';
import { View } from 'react-native';
import { TutorialOverlayMobile } from '@/components/tutorialOverlay.mobile';

export default function TutorialMobileLayout() {
  return (
    <View style={{ flex: 1 }}>
      {/* Las pantallas "Mock" (ej: index.tsx, ejercicio.tsx) se dibujan aquí al fondo */}
      <Slot />
      
      {/* El protector oscuro con los globos de texto va por encima */}
      <TutorialOverlayMobile />
    </View>
  );
}