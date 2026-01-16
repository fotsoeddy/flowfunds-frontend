import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAuth() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      // Check if token exists first to avoid unnecessary 401 calls
      // However, for consistency and security, we might want to let the API decide.
      // But typically we store token in sessionStorage.
      if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('access_token');
        if (!token) return null;
      }
      const response = await api.getProfile();
      return response.data;
    },
    retry: false,
    staleTime: Infinity, // User data rarely changes, keep it fresh until manual invalidation
  });
}
