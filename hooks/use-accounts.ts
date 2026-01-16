import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Define the Account interface here or import it if shared
export interface Account {
  id: string;
  name: string;
  number: string;
  type: string;
  balance: number;
}

export function useAccounts() {
  return useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await api.getAccounts();
      return response.data;
    },
  });
}
