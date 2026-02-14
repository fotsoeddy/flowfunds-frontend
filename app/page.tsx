"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { LogoLoader } from '@/components/ui/logo-loader';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { TotalBalance } from '@/components/dashboard/TotalBalance';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { WalletStack } from '@/components/dashboard/WalletStack';
import { AIChat } from '@/components/ai/AIChat';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const initDashboard = async () => {
      if (typeof window === 'undefined') return;
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [profileRes, accountsRes, transactionsRes] = await Promise.all([
          api.getProfile(),
          api.getAccounts(),
          api.getTransactions(),
        ]);

        setUser(profileRes.data);
        setAccounts(accountsRes.data);
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error("Dashboard init error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><LogoLoader size={60} /></div>;
  }

  // Helper to map account type to UI visuals
  const getAccountVisuals = (type: string) => {
     switch(type) {
         case 'momo':
             return { bgColor: 'bg-yellow-100', imageSrc: '/momo_logo.png' };
         case 'om':
             return { bgColor: 'bg-orange-100', imageSrc: '/om_logo.png' };
         default: // cash
             return { bgColor: 'bg-emerald-100', imageSrc: '/cash.png' }; 
     }
  };

  const processedAccounts = accounts.map(acc => ({
      ...acc,
      title: acc.name,
      ...getAccountVisuals(acc.type)
  }));

  const totalUsable = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
            Hello, {user?.first_name || 'User'}
        </h1>
        <p className="text-gray-600">Track your finances in real-time</p>
      </div>

      <div className="mb-8">
        <WalletStack accounts={processedAccounts} />
      </div>

      <TotalBalance total={totalUsable} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="text-emerald-600">
              View All
            </Button>
          </Link>
        </div>
        <RecentTransactions transactions={transactions} />
      </div>

      <AIChat />
    </div>
  );
}