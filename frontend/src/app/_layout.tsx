import '@/global.css';
import { useState, useEffect } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TutorialProvider, useTutorial } from '@/context/TutorialContext'; // <-- Importamos useTutorial también

import { TutorialOverlay } from '@/components/tutorialOverlay';
import type { TutorialStep } from '@/components/tutorialOverlay';

// 1. CREAMOS UN COMPONENTE INTERNO CON TODA TU LÓGICA
function RootLayoutContent() {
  const router = useRouter();
  const pathname = usePathname();
  
  
  const { isTutorialActive, setIsTutorialActive } = useTutorial();
  
  // Detectar rol según la ruta actual
  const [rol, setRol] = useState<'kine' | 'paciente'>('kine');
  
  useEffect(() => {
    setRol(pathname.startsWith('/paciente') ? 'paciente' : 'kine');
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeen = localStorage.getItem('tutorial_visto');
      setIsTutorialActive(hasSeen !== 'true');
    }
  }, []);

  // Escuchadores dinámicos para ambos roles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOpenKine = () => {
        router.push('/kinesiologo');
        setTimeout(() => setIsTutorialActive(true), 400);
      };

      const handleOpenPaciente = () => {
        router.push('/paciente');
        setTimeout(() => setIsTutorialActive(true), 400);
      };
      
      window.addEventListener('open-tutorial', handleOpenKine);
      window.addEventListener('open-tutorial-paciente', handleOpenPaciente);
      
      return () => {
        window.removeEventListener('open-tutorial', handleOpenKine);
        window.removeEventListener('open-tutorial-paciente', handleOpenPaciente);
      };
    }
  }, [router, setIsTutorialActive]);

  const closeTutorial = () => {
    setIsTutorialActive(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tutorial_visto', 'true');
    }
  };

  // Los 9 pasos del tutorial unificados de forma global
  const tutorialSteps: TutorialStep[] = [
    {
      elementSelector: '#tutorial-logo',
      text: '¡Hola Kinesiólogo! Bienvenido al Portal Profesional de Kinova, en donde vas a poder gestionar rutinas y ver el progreso de tus pacientes! Empecemos!',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-title',
      text: 'Bienvenido a tu Panel Central. Aquí vas a poder monitorear en tiempo real la adherencia, el progreso biomecánico y gestionar los tratamientos de todos tus pacientes activos o finalizados.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-add-patient',
      text: '¿Tenés un paciente nuevo? Presionando este botón vas a poder dar de alta su perfil clínico, ingresar sus datos de contacto y configurar las semanas estimadas para su proceso de rehabilitación.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-patient-row',
      text: "¡La magia de Kinova! Aquí ves la Adherencia (sesiones hechas en casa) y el Progreso (precisión de los ángulos calculados por la visión artificial). Tocá en 'Siguiente' para ajustar su rutina semanal.",
      position: 'bottom',
      onNavigate: () => router.push('/kinesiologo/paciente/1')
    },
    {
      elementSelector: '#tutorial-patient-name',
      text: "Este es el perfil del paciente, en el cual vas a poder planear y modificar la rutina del paciente de forma personalizada.",
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-duration',
      text: 'En esta sección, vas a poder modificar las semanas de tratamiento, en caso de que se necesite aumentar o disminuir.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-status',
      text: 'Aquí vas a poder administrar el estado del paciente, se podrá Finalizar en caso de estar activo o volver a activar en caso de estar finalizado.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-planning',
      text: '¡Aca está lo que nos interesa! Bienvenido a la rutina semanal del paciente, en esta sección vas a poder administrar la rutina del paciente a gusto.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-assign-btn',
      text: 'Para agregar ejercicios simplemente tocá este botón que te enviará directamente a la biblioteca de ejercicios.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-exercise-card',
      text: 'Si desea editar o borrar un ejercicio, lo podés hacer tocando los diferentes botones arriba del ejercicio.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-exercise-status',
      text: 'Aquí podrás ver si el paciente está cumpliendo o no con los ejercicios, una tilde significa que lo completó, mientras que una "x" significa que todavía no está completado.',
      position: 'bottom',
      onNavigate: () => router.push('/kinesiologo/biblioteca')
    },
    {
      elementSelector: '#tutorial-biblio-title',
      text: 'Bienvenido a la lista de ejercicios, aca vas a encontrar todos los ejercicios que necesites asignarles a tus pacientes',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-biblio-search',
      text: 'Aca vas a poder buscar los ejercicios por nombre',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-biblio-filter',
      text: 'Tambien podes filtrar por la parte del cuerpo que necesites!',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-biblio-card',
      text: 'Aca estan las tarjetas de los ejercicios, la cual viene con nombre e informacion importante del ejercicio',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-biblio-assign',
      text: 'Para agregar este ejercicio a la rutina del paciente, lo podes agregar facilmente haciendo click en "Asignar"',
      position: 'bottom',
      onNavigate: () => router.push('/kinesiologo')
    },
    {
      elementSelector: '#tutorial-title', 
      text: '¡Y eso es todo! 🎉 Ya estás listo para dominar Kinova. Empezá a gestionar tus pacientes, automatizar rutinas y llevar la rehabilitación al siguiente nivel. ¡Muchos éxitos en tu práctica!',
      position: 'bottom'
    }
  ];

  const tutorialPasosPaciente: TutorialStep[] = [
    {
      elementSelector: '#tutorial-welcome',
      text: '¡Bienvenido al portal de pacientes de Kinova! Aquí vas a poder ver tus ejercicios y realizar el seguimiento de tu rehabilitación.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-doctor',
      text: 'Este es tu kinesiólogo, el cual estará a cargo de tu rehabilitación, proceso y rutina.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-today-exercises',
      text: 'Estos son los ejercicios que tenés agendados para hoy. ¡Por favor asegurate de hacerlos y mantenerte al día!',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-exercise-card',
      text: 'Aquí tenés toda la información necesaria para empezar: repeticiones, series y el botón para iniciar el tratamiento con la tecnología de Kinova.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-mark-done',
      text: 'Una vez terminado el ejercicio, lo podés marcar como completado.',
      position: 'bottom'
    },
    {
      elementSelector: '#tutorial-upcoming',
      text: 'En este apartado podés ver cuáles son los próximos ejercicios que siguen en tu rutina.',
      position: 'top'
    },
    { 
      elementSelector: '#tutorial-ver-rutina', 
      text: 'Si querés ver tu rutina completa, podés hacer click aquí o en "Mi Calendario".', 
      position: 'bottom',
      onNavigate: () => router.push('/paciente/calendario')
    },
    { 
      elementSelector: '#tutorial-calendar-title', 
      text: 'Bienvenido al calendario, acá vas a poder ver tu rutina completa de la semana.', 
      position: 'bottom' 
    },
    { elementSelector: '#tutorial-calendar-days', text: 'Haciendo click en los diferentes días, vas a poder ver qué ejercicios tenés programados.', position: 'right' },
    { elementSelector: '#tutorial-video-demo', text: 'Haciendo click en "Video Demo" vas a poder ver una demostración técnica de cómo realizar el ejercicio correctamente.', position: 'bottom', onNavigate: () => router.push('/paciente/historial') },
    { elementSelector: '#tutorial-historial-title', text: 'Bienvenido al historial. Aquí encontrarás el registro detallado de tus sesiones pasadas, niveles de adherencia y métricas de tu progreso.', position: 'bottom', onNavigate: () => router.push('/paciente') },
    { elementSelector: '#tutorial-welcome', text: '¡Eso es todo! Ya conocés el portal de pacientes. ¡Mucha suerte en tu rehabilitación!', position: 'bottom' }
  ];

  const steps = rol === 'kine' ? tutorialSteps : tutorialPasosPaciente;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
      {isTutorialActive === true && (
        <TutorialOverlay steps={steps} onClose={closeTutorial} />
      )}
    </>
  );
}

// 2. EL EXPORT DEFAULT SE CONVIERTE EN EL FILTRO SUPERIOR (EL PROVIDER)
export default function RootLayout() {
  return (
    <TutorialProvider>
      <RootLayoutContent />
    </TutorialProvider>
  );
}