import { useState } from 'react';
import { useRouter } from 'expo-router';
import { api, saveToken } from '@/services/api';

interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export function useKinesiologoRegister() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !matricula.trim() || !password) {
      setError('Por favor completá todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/v1/auth/register/kinesiologo', {
        full_name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        matricula: matricula.trim(),
      });

      const loginData = await api.postForm<LoginResponse>('/api/v1/auth/login', {
        username: email.trim().toLowerCase(),
        password,
      });

      await saveToken(loginData.access_token);
      router.replace('/kinesiologo' as never);
    } catch (err: any) {
      setError(err.message ?? 'Error al registrarse. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => router.back();
  const goToLogin = () => router.push('/kinesiologo/login');

  return {
    name, setName,
    email, setEmail,
    matricula, setMatricula,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading, error,
    handleRegister,
    goBack,
    goToLogin,
  };
}
