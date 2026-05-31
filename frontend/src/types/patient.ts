export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  diagnosis: string;
  lastSession?: string;
  completionRate: number;
  status: 'active' | 'finished';
}

export interface PatientData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  diagnosis: string;
  treatmentWeeks: number;
  notes?: string;
}
