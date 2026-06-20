import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

const IS_WEB = Platform.OS === 'web';

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
      { text: 'Bienvenido al portal del paciente de Kinova. Desde esta interfaz podrá visualizar sus ejercicios prescritos y realizar el seguimiento continuo de su proceso de rehabilitación.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'Esta sección detalla los ejercicios programados para la jornada actual. Se solicita asegurar su ejecución sistemática para mantener la continuidad terapéutica.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'Aquí dispondrá de los parámetros clínicos necesarios para iniciar la sesión: series, repeticiones y el comando para activar el análisis biomecánico asistido.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'Al finalizar cada ejercicio, deberá registrar su cumplimiento seleccionando la opción correspondiente para actualizar el estado de su evolución.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'En este apartado podrá examinar la proyección de los siguientes bloques terapéuticos planificados en su rutina de tratamiento.', position: { bottom: '15%' }, arrow: 'none' },
    ]
  },
  calendario: {
    route: '/tutorialmobile/mock-calendario-mobile',
    nextScreen: 'historial',
    steps: [
      { text: 'Bienvenido al módulo de Calendario Semanal. Aquí podrá auditar la planificación cronológica completa de su tratamiento.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'Al seleccionar los diferentes días de la semana, el sistema desplegará el listado específico de las actividades programadas para dicha jornada.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'Al interactuar con la opción "Video Demo", accederá a una guía técnica audiovisual que ilustra la ejecución motriz correcta de cada ejercicio.', position: { bottom: '15%' }, arrow: 'none' },
    ]
  },
  historial: {
    route: '/tutorialmobile/mock-historial-mobile',
    nextScreen: null, // Final del recorrido
    steps: [
      { text: 'Bienvenido al Historial Clínico Personal. En esta sección encontrará el registro detallado de sus sesiones previas, índices de adherencia y métricas cuantitativas de su progreso.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'El recorrido introductorio ha finalizado. El portal se encuentra totalmente operativo para acompañarlo en su proceso de recuperación funcional.', position: { bottom: '15%' }, arrow: 'none' }
    ]
  },
  kine_inicio: {
    route: '/tutorialkine/mock-index',
    nextScreen: 'kine_detalle',
    steps: [
      { text: 'Bienvenido al panel de gestión clínica. Desde este módulo podrá centralizar y administrar el seguimiento integral de sus pacientes.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'Utilice la función "+Agregar" para registrar nuevos perfiles y generar de forma automatizada las credenciales de acceso al portal del paciente.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'El listado proporciona un resumen con métricas en tiempo real. Se sugiere monitorear el índice de adherencia terapéutica para evaluar el cumplimiento del tratamiento.', position: { bottom: '15%' }, arrow: 'none' },
    ]
  },
  kine_detalle: {
    route: '/tutorialkine/mock-detalle-mobile-kine',
    nextScreen: 'kine_biblioteca',
    steps: [
      { text: 'Este es el perfil clínico individual. Aquí visualizará el diagnóstico funcional, la duración del tratamiento y las notas evolutivas correspondientes.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'El indicador de adherencia cuantifica el porcentaje de cumplimiento de la prescripción de ejercicios, facilitando la evaluación objetiva del progreso.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'En la sección inferior se detalla la planificación semanal dosificada, permitiendo auditar la progresión del esquema terapéutico asignado.', position: { bottom: '15%' }, arrow: 'none' },
    ]
  },
  kine_biblioteca: {
    route: '/tutorialkine/mock-mobile-biblioteca-kine',
    nextScreen: null, // Fin del tutorial del kinesiólogo
    steps: [
      { text: 'Bienvenido a la Biblioteca Terapéutica. Este repositorio contiene el catálogo de ejercicios biomecánicos parametrizables para el diseño de rutinas.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'Seleccionando el icono "+" podrá asignar y dosificar variables biomecánicas de ejercicios específicos a la planificación de cualquier paciente activo.', position: { bottom: '15%' }, arrow: 'none' },
      { text: 'El recorrido guiado ha concluido. El sistema se encuentra operativo para optimizar la gestión integral de los procesos de rehabilitación.', position: { bottom: '15%' }, arrow: 'none' }
    ]
  }
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
    router.push(TUTORIAL_MOBILE_CONFIG['inicio'].route as any);
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

  const activeStepData = !IS_WEB && isTutorialActive ? TUTORIAL_MOBILE_CONFIG[currentScreen].steps[currentStep] : null;

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