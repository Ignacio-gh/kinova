import Constants from 'expo-constants';
import { Platform } from 'react-native';

// URL base del backend — usada tanto por el cliente HTTP (api.ts) como por
// el WebSocket de pose (use-pose-websocket.ts). Antes cada uno reimplementaba
// esta misma lógica por su cuenta y ya habían empezado a divergir (uno tenía
// el fallback especial de emulador Android, el otro no).
//
// Prioridad:
//   1. EXPO_PUBLIC_API_URL (ej. producción, o ngrok/tunnels en dev)
//   2. Web → el backend corre en el mismo localhost
//   3. Dispositivo físico/Expo Go → IP del servidor de desarrollo expuesta
//      por Expo (Constants.expoConfig.hostUri = "192.168.x.x:8081"),
//      asumiendo que el backend corre en el mismo host, puerto 8000
//   4. Fallback: IP especial que usa el emulador de Android para el host
export function getBackendUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:8000';
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as unknown as { manifest?: { debuggerHost?: string } }).manifest?.debuggerHost;
  const host = hostUri?.split(':')[0];
  if (host) {
    return `http://${host}:8000`;
  }

  return 'http://10.0.2.2:8000';
}
