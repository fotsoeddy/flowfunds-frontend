"use client";

import { TransactionList } from '@/components/transactions/TransactionList';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TransactionsPage() {
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
  return (
    <div className="container px-4 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600">All your income and expenses</p>
      </div>
      
      <TransactionList />
    </div>
  );
}