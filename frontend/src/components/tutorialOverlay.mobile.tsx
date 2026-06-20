import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTutorial, TUTORIAL_MOBILE_CONFIG } from '@/context/TutorialContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUBBLE_WIDTH = SCREEN_WIDTH * 0.88;
const BUBBLE_LEFT = (SCREEN_WIDTH - BUBBLE_WIDTH) / 2;

export function TutorialOverlayMobile() {
  const {
    isTutorialActive, currentScreen, currentStep,
    activeStepData, nextMobile, prevMobile, stopMobileTutorial,
  } = useTutorial();

  if (!isTutorialActive || !activeStepData) return null;

  const config = TUTORIAL_MOBILE_CONFIG[currentScreen];
  const isFinalStep = config.nextScreen === null && currentStep === config.steps.length - 1;
  const isVeryFirstStep =
    (currentScreen === 'inicio' || currentScreen === 'kine_inicio') && currentStep === 0;

  const handleNext = () => {
    if (activeStepData.onNavigate) activeStepData.onNavigate();
    nextMobile();
  };

  const arrow = activeStepData.arrow ?? 'none';

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,22,40,0.58)', zIndex: 50 }}
      pointerEvents="auto"
    >
      {/* ── Burbuja ─────────────────────────────────────────── */}
      <View
        style={[
          {
            position: 'absolute',
            width: BUBBLE_WIDTH,
            left: BUBBLE_LEFT,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 20,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
          },
          activeStepData.position as object,
        ]}
      >
        {/* Triángulo superior */}
        {arrow === 'top' && (
          <View style={{
            position: 'absolute', top: -13, left: 0, right: 0, alignItems: 'center',
          }}>
            <View style={{
              width: 0, height: 0,
              borderLeftWidth: 13, borderRightWidth: 13, borderBottomWidth: 13,
              borderLeftColor: 'transparent', borderRightColor: 'transparent',
              borderBottomColor: '#FFFFFF',
            }} />
          </View>
        )}

        {/* Encabezado: paso + dots */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#00A896', textTransform: 'uppercase', letterSpacing: 1 }}>
            Paso {currentStep + 1} de {config.steps.length}
          </Text>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            {config.steps.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === currentStep ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === currentStep ? '#00A896' : '#E5E7EB',
                }}
              />
            ))}
          </View>
        </View>

        {/* Texto */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#002B49', lineHeight: 21, marginBottom: 18 }}>
          {activeStepData.text}
        </Text>

        {/* Botones */}
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6',
        }}>
          <TouchableOpacity
            onPress={prevMobile}
            disabled={isVeryFirstStep}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 16, paddingVertical: 10,
              borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
              backgroundColor: '#F9FAFB',
              opacity: isVeryFirstStep ? 0.35 : 1,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280' }}>Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 22, paddingVertical: 10,
              borderRadius: 12, backgroundColor: '#00A896',
              flexDirection: 'row', alignItems: 'center', gap: 6,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>
              {isFinalStep ? 'Finalizar' : 'Siguiente'}
            </Text>
            {!isFinalStep && <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />}
            {isFinalStep && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>

        {/* Triángulo inferior */}
        {arrow === 'bottom' && (
          <View style={{
            position: 'absolute', bottom: -13, left: 0, right: 0, alignItems: 'center',
          }}>
            <View style={{
              width: 0, height: 0,
              borderLeftWidth: 13, borderRightWidth: 13, borderTopWidth: 13,
              borderLeftColor: 'transparent', borderRightColor: 'transparent',
              borderTopColor: '#FFFFFF',
            }} />
          </View>
        )}
      </View>

      {/* ── Botón cerrar ────────────────────────────────────── */}
      <TouchableOpacity
        onPress={stopMobileTutorial}
        activeOpacity={0.8}
        style={{
          position: 'absolute', bottom: 32, alignSelf: 'center',
          flexDirection: 'row', alignItems: 'center', gap: 6,
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
          paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
        }}
      >
        <Ionicons name="close" size={15} color="#FFFFFF" />
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>Salir del tutorial</Text>
      </TouchableOpacity>
    </View>
  );
}
