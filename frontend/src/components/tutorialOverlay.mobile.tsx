import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTutorial, TUTORIAL_MOBILE_CONFIG } from '@/context/TutorialContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function TutorialOverlayMobile() {
  const { isTutorialActive, currentScreen, currentStep, activeStepData, nextMobile, prevMobile, stopMobileTutorial } = useTutorial();

  if (!isTutorialActive || !activeStepData) return null;

  // Lógica dinámica para saber si es el final absoluto
  const currentConfig = TUTORIAL_MOBILE_CONFIG[currentScreen];
  const isLastScreen = currentConfig.nextScreen === null;
  const isLastStep = currentStep === (currentConfig.steps.length - 1);
  const isFinalStep = isLastScreen && isLastStep;

  const handleNext = () => {
  const step = activeStepData;
  // Si el paso actual tiene una acción de navegación, ejecútala
  if (step?.onNavigate) {
    step.onNavigate();
  }
  
  // Llamamos a la lógica del contexto para avanzar o cambiar de pantalla
  nextMobile(); 
};

  return (

    
    <View 
      className="absolute inset-0 z-50 pointer-events-auto" 
      style={{ backgroundColor: 'rgba(10, 22, 40, 0.5)' }} 
      pointerEvents="auto"
    >
      
      {/* Globo Flotante Informativo */}
      <View 
        className="absolute bg-white rounded-3xl p-5 shadow-2xl" 
        style={[{ width: SCREEN_WIDTH * 0.85, elevation: 10 }, activeStepData.position as any]}
      >
        <View className="mb-4">
          <Text className="text-xs font-bold text-turquoise uppercase tracking-widest mb-1.5">
            PASO {currentStep + 1}
          </Text>
          <Text className="text-navy text-sm font-semibold leading-5">
            {activeStepData.text}
          </Text>
        </View>
        
        <View className="flex-row justify-end gap-3 pt-4 border-t border-gray-100">
          {/* Botón Atrás */}
          <TouchableOpacity 
            className={`px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 items-center justify-center ${(currentScreen === 'inicio' && currentStep === 0) ? 'opacity-40' : ''}`}
            onPress={prevMobile}
            disabled={currentScreen === 'inicio' && currentStep === 0}
            activeOpacity={0.7}
          >
            <Text className="text-gray-500 font-semibold text-xs">Volver</Text>
          </TouchableOpacity>
          
          {/* Botón Siguiente */}
<TouchableOpacity 
  className="px-5 py-2.5 rounded-xl items-center justify-center bg-turquoise" 
  onPress={handleNext} // Usá handleNext que ya tenías preparado
  activeOpacity={0.8}
>
  <Text className="text-white font-bold text-xs">
    {isFinalStep ? 'Finalizar' : 'Siguiente'}
  </Text>
</TouchableOpacity>
        </View>
      </View>

      {/* Botón de Cierre Absoluto */}
      <TouchableOpacity 
        className="absolute bottom-8 right-5 flex-row items-center bg-red-500 px-5 py-3 rounded-full shadow-lg"
        onPress={stopMobileTutorial} 
        activeOpacity={0.8}
        style={{ elevation: 5 }}
      >
        <Ionicons name="close-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
        <Text className="text-white text-xs font-bold">Cerrar Tutorial</Text>
      </TouchableOpacity>
    </View>
  );

  
}