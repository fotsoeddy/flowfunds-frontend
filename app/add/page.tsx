"use client";

import { TransactionForm } from '@/components/transactions/TransactionForm';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AddTransactionPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  if (!isAuthenticated) return null;
  return <TransactionForm />;
}