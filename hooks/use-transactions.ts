import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'save';
  amount: number;
  description?: string; // or reason
  reason?: string;
  date: string;
  account_name?: string;
}

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.getTransactions();
      return response.data;
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.createTransaction(data),
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
