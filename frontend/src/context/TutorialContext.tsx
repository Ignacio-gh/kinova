import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'expo-router';

// --- Tipos para la versión Mobile ---
export type ScreenKeyMobile = 
  | 'inicio' | 'calendario' | 'historial' 
  | 'kine_inicio' | 'kine_detalle' | 'kine_biblioteca';

export type StepConfigMobile = {
  text: string;
  position: { top?: string | number; bottom?: string | number; left?: string | number; right?: string | number };
  arrow?: 'top' | 'bottom' | 'none';       // <-- Agregamos esto
  arrowPosition?: string | number;         // <-- Y agregamos esto
  onNavigate?: () => void;
};

export const TUTORIAL_MOBILE_CONFIG: Record<ScreenKeyMobile, { route: string; nextScreen: ScreenKeyMobile | null; steps: StepConfigMobile[] }> = {
  inicio: {
    route: '/tutorialmobile/mock-index-mobile',
    nextScreen: 'calendario',
    steps: [
      {
        text: '¡Bienvenido a Kinova! Esta es tu pantalla principal. Acá vas a ver tus ejercicios del día y tu progreso semanal.',
        position: { bottom: '22%' },
        arrow: 'none',
      },
      {
        text: 'Estos son tus ejercicios del día. Deslizá las tarjetas para verlos todos.',
        position: { top: '20%' },
        arrow: 'none',
      },
      {
        text: 'Cada tarjeta tiene las repeticiones, series y el botón para iniciar el análisis con la cámara.',
        position: { bottom: '30%' },
        arrow: 'top',
      },
      {
        text: 'Cuando terminés un ejercicio, marcalo como completado para registrar tu avance.',
        position: { bottom: '22%' },
        arrow: 'top',
      },
      {
        text: 'Acá abajo ves los próximos ejercicios de tu rutina semanal.',
        position: { top: '12%' },
        arrow: 'bottom',
      },
    ],
  },
  calendario: {
    route: '/tutorialmobile/mock-calendario-mobile',
    nextScreen: 'historial',
    steps: [
      {
        text: 'Este es tu calendario semanal con todos los ejercicios de tu tratamiento.',
        position: { bottom: '22%' },
        arrow: 'none',
      },
      {
        text: 'Tocá los días para ver qué ejercicios te corresponden ese día.',
        position: { bottom: '30%' },
        arrow: 'top',
      },
      {
        text: 'Con "Video Demo" podés ver cómo ejecutar correctamente cada ejercicio antes de hacerlo.',
        position: { top: '18%' },
        arrow: 'bottom',
      },
    ],
  },
  historial: {
    route: '/tutorialmobile/mock-historial-mobile',
    nextScreen: null,
    steps: [
      {
        text: 'Acá están todas tus sesiones completadas con estadísticas de adherencia y tiempo total.',
        position: { bottom: '22%' },
        arrow: 'none',
      },
      {
        text: '¡Eso es todo! Ya conocés la app. El tutorial está siempre disponible desde tu pantalla principal.',
        position: { top: '36%' },
        arrow: 'none',
      },
    ],
  },
  kine_inicio: {
    route: '/tutorialkine/mock-index-mobile-kine',
    nextScreen: 'kine_detalle',
    steps: [
      {
        text: 'Bienvenido al panel del kinesiólogo. Desde acá gestionás a todos tus pacientes.',
        position: { bottom: '22%' },
        arrow: 'none',
      },
      {
        text: 'Tocá "Agregar" para dar de alta un nuevo paciente. El sistema genera sus credenciales automáticamente.',
        position: { top: '20%' },
        arrow: 'top',
      },
      {
        text: 'En la lista ves el porcentaje de adherencia de cada paciente de un vistazo. Un valor bajo puede indicar que necesita seguimiento.',
        position: { bottom: '22%' },
        arrow: 'top',
      },
    ],
  },
  kine_detalle: {
    route: '/tutorialkine/mock-detalle-mobile-kine',
    nextScreen: 'kine_biblioteca',
    steps: [
      {
        text: 'Acá está toda la info clínica del paciente: diagnóstico, semanas de tratamiento y notas.',
        position: { bottom: '30%' },
        arrow: 'top',
      },
      {
        text: 'La adherencia muestra qué porcentaje de ejercicios completó. Es tu principal indicador de seguimiento.',
        position: { top: '28%' },
        arrow: 'top',
      },
      {
        text: 'Y acá abajo la rutina semanal dosificada que le asignaste, día por día.',
        position: { top: '12%' },
        arrow: 'bottom',
      },
    ],
  },
  kine_biblioteca: {
    route: '/tutorialkine/mock-mobile-biblioteca-kine',
    nextScreen: null,
    steps: [
      {
        text: 'Esta es la biblioteca con todos los ejercicios disponibles para prescribir.',
        position: { bottom: '22%' },
        arrow: 'none',
      },
      {
        text: 'Con el botón "+" podés asignar cualquier ejercicio a un paciente y definir sus parámetros.',
        position: { bottom: '28%' },
        arrow: 'top',
      },
      {
        text: '¡Listo! Ya dominás Kinova. Ahora podés gestionar la rehabilitación de tus pacientes de forma eficiente.',
        position: { top: '36%' },
        arrow: 'none',
      },
    ],
  },
};

// ... (El resto del Provider queda igual que antes)
// Asegurate de que el Provider exporte el nextMobile y prevMobile que manejen el cambio de ScreenKey

type TutorialContextType = {
  // Compartido
  isTutorialActive: boolean;
  setIsTutorialActive: (active: boolean) => void;
  
  // Exclusivo Mobile
  currentScreen: ScreenKeyMobile;
  currentStep: number;
  activeStepData: StepConfigMobile | null;
  
  // <-- ACTUALIZÁ ESTA LÍNEA -->
  startMobileTutorial: (startScreen?: ScreenKeyMobile) => void; 
  
  stopMobileTutorial: () => void;
  nextMobile: () => void;
  prevMobile: () => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Estado original (Web y Mobile)
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  
  // Estados Mobile
  const [currentScreen, setCurrentScreen] = useState<ScreenKeyMobile>('inicio');
  const [currentStep, setCurrentStep] = useState(0);

  // --- Funciones exclusivas Mobile ---
  const startMobileTutorial = (startScreen: ScreenKeyMobile = 'inicio') => {
    setCurrentScreen(startScreen);
    setCurrentStep(0);
    setIsTutorialActive(true);
    router.push(TUTORIAL_MOBILE_CONFIG[startScreen].route as any);
  };

  const stopMobileTutorial = () => {
    setIsTutorialActive(false);
    
    // Determinamos a dónde volver según qué tutorial estábamos viendo
    if (currentScreen.startsWith('kine_')) {
      router.replace('/kinesiologo' as never); // Devuelve al inicio del Kinesiólogo
    } else {
      router.replace('/paciente' as never); // Devuelve al inicio del Paciente
    }
  };

  const nextMobile = () => {
  const config = TUTORIAL_MOBILE_CONFIG[currentScreen];
  
  if (currentStep < config.steps.length - 1) {
    setCurrentStep(prev => prev + 1);
  } else {
    // Si llegamos al último paso de esta pantalla
    if (config.nextScreen) {
      const nextKey = config.nextScreen;
      setCurrentScreen(nextKey);
      setCurrentStep(0);
      router.push(TUTORIAL_MOBILE_CONFIG[nextKey].route as any);
    } else {
      stopMobileTutorial(); // Termina todo
    }
  }
};

  const prevMobile = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      // Lógica dinámica para volver a la pantalla anterior
      const screens = Object.keys(TUTORIAL_MOBILE_CONFIG) as ScreenKeyMobile[];
      const currentIndex = screens.indexOf(currentScreen);
      
      if (currentIndex > 0) {
        const prevKey = screens[currentIndex - 1];
        setCurrentScreen(prevKey);
        // Saltamos al último paso de la pantalla anterior
        setCurrentStep(TUTORIAL_MOBILE_CONFIG[prevKey].steps.length - 1);
        router.push(TUTORIAL_MOBILE_CONFIG[prevKey].route as any);
      }
    }
  };

  const activeStepData = isTutorialActive ? TUTORIAL_MOBILE_CONFIG[currentScreen].steps[currentStep] : null;

  return (
    <TutorialContext.Provider value={{ 
      isTutorialActive, setIsTutorialActive, 
      currentScreen, currentStep, activeStepData, 
      startMobileTutorial, stopMobileTutorial, nextMobile, prevMobile 
    }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) throw new Error('useTutorial debe usarse dentro de un TutorialProvider');
  return context;
}