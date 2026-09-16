import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser, DEMO_MODE } from '@/lib/auth';

/**
 * Custom hook to handle authentication checks with demo mode support
 * @param redirectUrl - URL to redirect to if not authenticated (ignored in demo mode)
 * @returns user object or null
 */
export function useAuthCheck(redirectUrl: string) {
  const router = useRouter();
  const user = getStoredUser();

  useEffect(() => {
    // Skip auth check in demo mode
    if (DEMO_MODE) return;
    
    // Redirect to login if not authenticated
    if (!user) {
      router.replace(`/portal/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [user, router, redirectUrl]);

  return user;
}