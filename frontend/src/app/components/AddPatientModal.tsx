import { useState } from 'react';
import { X, User, Mail, Phone, Calendar, FileText, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (patient: PatientData) => void;
}

export interface PatientData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  diagnosis: string;
  treatmentWeeks: number; // <-- Agregado a la interfaz de tipado
  notes: string;
}

export function AddPatientModal({ isOpen, onClose, onAdd }: AddPatientModalProps) {
  const { colors, theme } = useTheme();
  const [formData, setFormData] = useState<PatientData>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    diagnosis: '',
    treatmentWeeks: 4, // <-- Inicializado por defecto en 4 semanas
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', email: '', phone: '', birthDate: '', diagnosis: '', treatmentWeeks: 4, notes: '' });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="rounded-3xl shadow-2xl max-w-2xl w-full" style={{ backgroundColor: colors.surface }}>
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b" style={{ borderColor: colors.border }}>
            <h3 className="text-3xl font-bold" style={{ color: colors.primaryText }}>
              Agregar Nuevo Paciente
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }}
            >
              <X size={24} style={{ color: colors.primaryText }} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Name */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.primaryText }}>
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: colors.secondaryText }}
                  />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Pérez"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.primaryText,
                      '--tw-ring-color': '#00A896'
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.primaryText }}>
                  Email *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: colors.secondaryText }}
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="paciente@email.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.primaryText,
                      '--tw-ring-color': '#00A896'
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.primaryText }}>
                  Teléfono
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: colors.secondaryText }}
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+54 11 1234-5678"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.primaryText,
                      '--tw-ring-color': '#00A896'
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.primaryText }}>
                  Fecha de Nacimiento
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: colors.secondaryText }}
                  />
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.primaryText,
                      '--tw-ring-color': '#00A896'
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.primaryText }}>
                  Diagnóstico
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: colors.secondaryText }}
                  />
                  <input
                    type="text"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    placeholder="Ej: Lesión de rodilla"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.primaryText,
                      '--tw-ring-color': '#00A896'
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Duración del Tratamiento en Semanas (Nuevo campo acoplado) */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.primaryText }}>
                  Duración Tratamiento (Semanas) *
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    size={18}
                    style={{ color: colors.secondaryText }}
                  />
                  <input
                    type="number"
                    required
                    min="1"
                    max="52"
                    value={formData.treatmentWeeks}
                    onChange={(e) => setFormData({ ...formData, treatmentWeeks: parseInt(e.target.value) || 1 })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.primaryText,
                      '--tw-ring-color': '#00A896'
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.primaryText }}>
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Información adicional sobre el paciente..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{
                    backgroundColor: colors.inputBg,
                    borderColor: colors.border,
                    color: colors.primaryText,
                    '--tw-ring-color': '#00A896'
                  } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-xl transition-all border font-semibold"
                style={{
                  borderColor: colors.border,
                  color: colors.primaryText,
                  backgroundColor: 'transparent'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
                style={{
                  backgroundColor: '#00A896',
                  color: '#ffffff'
                }}
              >
                Agregar Paciente
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
