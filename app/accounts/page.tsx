"use client";

import { DollarSign, Smartphone, CircleDollarSign, Building, LogOut } from 'lucide-react';
import { AccountCard } from '@/components/accounts/AccountCard';
import { CreditCardFront } from '@/components/dashboard/CreditCardFront';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AccountsPage() {
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

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  const activeAccounts = [
    {
      id: 'cash' as const,
      name: 'Cash',
      balance: 1250,
      icon: DollarSign,
    },
    {
      id: 'momo' as const,
      name: 'MoMo',
      balance: 875,
      icon: Smartphone,
    },
    {
      id: 'om' as const,
      name: 'Orange Money',
      balance: 420,
      icon: CircleDollarSign,
    },
  ];

  const savingsAccount = {
    id: 'bank' as const,
    name: 'Bank Savings',
    balance: 3500,
    icon: Building,
  };

  const totalUsable = activeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalSavings = savingsAccount.balance;
  const totalNetWorth = totalUsable + totalSavings;

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600">Manage your money across accounts</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout} 
          className="text-gray-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-6 w-6" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>

      {/* Credit Card Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Card</h2>
        <CreditCardFront />
      </div>

      <div className="rounded-lg bg-gray-50 p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Usable Money</p>
            <p className="text-xl font-bold text-gray-900">
              ${totalUsable.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Worth</p>
            <p className="text-xl font-bold text-emerald-700">
              ${totalNetWorth.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Accounts</h2>
        <div className="space-y-4">
          {activeAccounts.map((account) => (
            <AccountCard key={account.id} {...account} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Savings</h2>
        <div className="space-y-4">
          <AccountCard {...savingsAccount} isActive={false} />
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">Bank Account Info</p>
            <p className="text-xs text-blue-600 mt-1">
              This account is for savings only. Money can only be added through the "Save" transaction type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}