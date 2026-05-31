import { useState } from 'react';
import { useRouter } from 'expo-router';

export function usePacienteLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // TODO: conectar authService.loginPaciente({ email, password })
      router.replace('/paciente' as never);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => router.back();

  return { email, setEmail, password, setPassword, loading, handleLogin, goBack };
}
