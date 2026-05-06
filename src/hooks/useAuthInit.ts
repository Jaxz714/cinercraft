import { useEffect } from 'react';
import { useAuthStore } from './useAuth';

export function useAuthInit() {
  const { initialize, isLoading } = useAuthStore();
  
  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);
  
  return { isLoading };
}
