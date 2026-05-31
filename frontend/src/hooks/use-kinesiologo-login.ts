import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useKinesiologoLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // TODO: conectar authService.loginKinesiologo({ email, password })
      router.replace('/kinesiologo' as never);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => router.back();
  const goToRegister = () => router.push('/kinesiologo/register');

  return { email, setEmail, password, setPassword, loading, handleLogin, goBack, goToRegister };
}
