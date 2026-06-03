import React, { createContext, useContext, useState } from 'react';

type TutorialContextType = {
  isTutorialActive: boolean;
  setIsTutorialActive: (active: boolean) => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isTutorialActive, setIsTutorialActive] = useState(false);

  return (
    <TutorialContext.Provider value={{ isTutorialActive, setIsTutorialActive }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial debe usarse dentro de un TutorialProvider');
  }
  return context;
}