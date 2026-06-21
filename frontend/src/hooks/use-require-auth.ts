import { useEffect, useState } from 'react';
import { readToken } from '@/services/api';

export type AuthStatus = 'loading' | 'auth' | 'unauth';

export function useRequireAuth(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    readToken().then((token) => {
      setStatus(token ? 'auth' : 'unauth');
    });
  }, []);

  return status;
}
