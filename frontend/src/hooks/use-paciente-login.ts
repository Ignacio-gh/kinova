import { useState } from 'react';
import { useRouter } from 'expo-router';
import { api, saveToken } from '@/services/api';

interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export function usePacienteLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Ingresá tu email y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.postForm<LoginResponse>('/api/v1/auth/login', {
        username: email.trim().toLowerCase(),
        password,
      });

      await saveToken(data.access_token);
      router.replace('/paciente' as never);
      
    } catch (err: any) {
      // --- AQUÍ ESTÁ EL NUEVO CATCH CORRECTAMENTE UBICADO ---
      console.log("Error completo de la API:", err);
      
      // Buscamos si el backend mandó un mensaje específico
      const mensajeBackend = 
        err?.response?.data?.detail || 
        err?.response?.data?.message || 
        err?.message;

      setError(typeof mensajeBackend === 'string' ? mensajeBackend : 'Email o contraseña incorrectos.');
      // ------------------------------------------------------
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => router.back();

  return { email, setEmail, password, setPassword, loading, error, handleLogin, goBack };
}