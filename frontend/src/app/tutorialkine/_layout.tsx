import { Slot } from 'expo-router';
import { View } from 'react-native';
import { TutorialOverlayMobile } from '@/components/tutorialOverlay.mobile';

export default function TutorialKineLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <TutorialOverlayMobile />
    </View>
  );
}