import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useKinesiologoRegister() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      // TODO: validar password === confirmPassword
      // TODO: authService.registerKinesiologo({ name, email, password })
      await new Promise((r) => setTimeout(r, 0));
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => router.back();
  const goToLogin = () => router.push('/kinesiologo/login');

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading,
    handleRegister,
    goBack,
    goToLogin,
  };
}
