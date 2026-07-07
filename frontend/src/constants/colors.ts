// Paleta de marca compartida por las pantallas web de Kinova.
// Antes cada pantalla redefinía estos mismos valores en su propio
// `const C = {...}`; esto centraliza los que se repiten para que
// cambiar un color de marca no requiera tocar 20+ archivos.
//
// Uso típico en una pantalla:
//   const C = { ...KinovaColors, /* extras propios de esta pantalla */ };
export const KinovaColors = {
  turquoise: '#00A896',
  turquoiseBg: '#e5f7f5',
  navy: '#002B49',
  white: '#FFFFFF',
  bg: '#F1F5F9',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  border: '#E5E7EB',
  green: '#16A34A',
  amber: '#F59E0B',
  red: '#EF4444',
} as const;
