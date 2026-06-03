import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'expo-router'; 

export interface TutorialStep {
  elementSelector: string;
  text: string;
  position?: 'top' | 'right' | 'bottom';
  onActivate?: () => void;
  onNavigate?: () => void;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onClose: () => void;
}

export function TutorialOverlay({ steps, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); 

  useEffect(() => {
  const step = steps[currentStep];
  if (!step) return;

  const element = document.querySelector(step.elementSelector);
  if (element) {
    
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

    if (step.onActivate) {
      step.onActivate();
    }

    // Definimos la función de actualización sin parámetros obligatorios
    const updatePosition = (retryCount = 0) => {
      requestAnimationFrame(() => {
        const step = steps[currentStep];
        if (!step) return;

        const element = document.querySelector(step.elementSelector);
        
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top === 0 && rect.left === 0 && retryCount < 10) {
            setTimeout(() => updatePosition(retryCount + 1), 100);
          } else {
            setCoords({
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            });
          }
        } else if (retryCount < 15) { 
          setTimeout(() => updatePosition(retryCount + 1), 200);
        }
      });

      const element = document.querySelector(step.elementSelector);
      console.log("Buscando selector:", step.elementSelector, "Encontrado:", !!element);
    };

    // Primera ejecución
    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentStep, pathname, steps]);

  const handleNext = () => {
    const currentStepData = steps[currentStep];
    
    // Ejecutar navegación si existe
    if (currentStepData.onNavigate) {
      currentStepData.onNavigate();
    }

    // Avanzar de paso
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  const hasValidPosition = coords.top !== 0 || coords.left !== 0;
  const preferredPosition = currentStepData.position || 'top';

  let bubbleStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: '#071220', // Azul profundo oficial de Kinova
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: '1px',
    borderStyle: 'solid',
  };

  let widthClass = "w-72 p-5"; 
  let arrowStyle: React.CSSProperties = {}; 

  if (!hasValidPosition) {
    bubbleStyle = {
      ...bubbleStyle,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  } else if (preferredPosition === 'right') {
    widthClass = "w-[440px] px-6 py-4"; 
    bubbleStyle = {
      ...bubbleStyle,
      top: `${coords.top + coords.height / 2}px`,
      left: `${coords.left + coords.width + 16}px`, 
      transform: 'translate(0, -50%)', 
    };
  } else if (preferredPosition === 'bottom') {
    // FORMATO ANCHO APAISADO
    widthClass = "w-[450px] px-6 py-4"; 
    
    // Verificamos si el elemento está tirado al borde derecho
    const isAtRightEdge = (coords.left + 450) > window.innerWidth;

    if (isAtRightEdge) {
      bubbleStyle = {
        ...bubbleStyle,
        top: `${coords.top + coords.height + 12}px`, 
        right: `${window.innerWidth - (coords.left + coords.width)}px`,
      };
      arrowStyle = {
        right: `${coords.width / 2 - 8}px`,
      };
    } else {
      bubbleStyle = {
        ...bubbleStyle,
        top: `${coords.top + coords.height + 12}px`, 
        left: `${coords.left}px`,
      };
      arrowStyle = {
        left: `32px`, 
      };
    }
  } else {
    bubbleStyle = {
      ...bubbleStyle,
      top: `${coords.top - 16}px`,
      left: `${coords.left + coords.width / 2}px`,
      transform: 'translate(-50%, -100%)',
    };
  }

  // Identificamos si es el último paso
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }}>
      <div 
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropBlur: '2px' } as any} 
        onClick={onClose} 
      />

      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'transparent',
          border: '0',
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: 'bold',
          textDecorationLine: 'underline',
          textDecorationStyle: 'solid',
          cursor: 'pointer',
          zIndex: 9999
        }}
      >
        Cerrar tutorial
      </button>

      <div
        ref={bubbleRef}
        style={bubbleStyle}
        className={`${widthClass} rounded-2xl shadow-2xl transition-all duration-300 flex flex-col justify-between`}
      >
        <div className="mb-3">
          <p className="text-xs uppercase tracking-wide font-bold mb-1 text-teal-400">
            Paso {currentStep + 1} de {steps.length}
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-200">
            {currentStepData.text}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          {isLastStep ? (
            /* --- SI ES EL ÚLTIMO PASO: Solo mostramos "Finalizar" a todo lo ancho --- */
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
              style={{ backgroundColor: '#00A896', textAlign: 'center' }}
            >
              Finalizar
            </button>
          ) : (
            /* --- SI NO ES EL ÚLTIMO PASO: Mostramos "Atrás" y "Siguiente" --- */
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 text-slate-400 disabled:opacity-30 min-w-[80px] cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white min-w-[80px] cursor-pointer"
                style={{ backgroundColor: '#00A896' }}
              >
                Siguiente
              </button>
            </>
          )}
        </div>

        {hasValidPosition && preferredPosition === 'top' && (
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-x-[8px] border-x-transparent border-t-[8px]"
            style={{ borderTopColor: '#071220' }}
          />
        )}
        {hasValidPosition && preferredPosition === 'right' && (
          <div 
            className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[8px]"
            style={{ borderRightColor: '#071220' }}
          />
        )}
        {hasValidPosition && preferredPosition === 'bottom' && (
          <div 
            className="absolute top-0 transform -translate-y-full w-0 h-0 border-x-[8px] border-x-transparent border-b-[8px]"
            style={{ borderBottomColor: '#071220', ...arrowStyle }}
          />
        )}
      </div>
    </div>
  );
}