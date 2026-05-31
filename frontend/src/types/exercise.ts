export type FeedbackState = 'perfect' | 'improve' | 'bad';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  scheduledTime?: string;
}

export const feedbackConfig: Record<FeedbackState, { bg: string; label: string; icon: string }> = {
  perfect: { bg: '#4CAF50', label: '¡Postura Correcta!', icon: '✓' },
  improve: { bg: '#FFC107', label: 'Mejorar Postura',    icon: '⚠' },
  bad:     { bg: '#FF4D4D', label: 'Postura Incorrecta', icon: '✕' },
};
