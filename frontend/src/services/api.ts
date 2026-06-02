import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getBaseUrl(): string {
  // Variable de entorno manual tiene prioridad (útil para ngrok u otros tunnels)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // En web, el backend corre en el mismo localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:8000';
  }

  // En dispositivo físico/emulador, Expo expone la IP del servidor de desarrollo.
  // Se extrae esa IP y se apunta al puerto del backend.
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (host) {
    return `http://${host}:8000`;
  }

  // Fallback: emulador Android usa esta IP especial para el host
  return 'http://10.0.2.2:8000';
}

const BASE_URL = getBaseUrl();
const TOKEN_KEY = 'kinova-token';

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    // El backend devuelve { message } — FastAPI validation devuelve { detail }
    throw new Error(error.message ?? error.detail ?? 'Error desconocido');
  }

  return response.json() as Promise<T>;
}

// Login usa OAuth2PasswordRequestForm (application/x-www-form-urlencoded)
async function requestForm<T>(path: string, body: Record<string, string>): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? error.detail ?? 'Error desconocido');
  }

  return response.json() as Promise<T>;
}

export const api = {
  get:      <T>(path: string)                            => request<T>(path),
  post:     <T>(path: string, body: unknown)             => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put:      <T>(path: string, body: unknown)             => request<T>(path, { method: 'PUT',  body: JSON.stringify(body) }),
  delete:   <T>(path: string)                            => request<T>(path, { method: 'DELETE' }),
  postForm: <T>(path: string, body: Record<string, string>) => requestForm<T>(path, body),
};
