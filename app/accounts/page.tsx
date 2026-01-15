"use client";

import { DollarSign, Smartphone, CircleDollarSign, Building, LogOut } from 'lucide-react';
import { AccountCard } from '@/components/accounts/AccountCard';
import { CreditCardFront } from '@/components/dashboard/CreditCardFront';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

// Define the Account interface matching backend response
interface Account {
  id: string;
  name: string;
  number: string;
  type: string;
  balance: number;
}

export default function AccountsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [accountsRes, profileRes] = await Promise.all([
        api.getAccounts(),
        api.getProfile()
      ]);
      setAccounts(accountsRes.data);
      setUserPhone(profileRes.data.phone_number);
      setUserName(`${profileRes.data.first_name} ${profileRes.data.last_name}`);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  // Helper to map account type to icon/image
  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'momo':
        return Smartphone;
      case 'om':
        return CircleDollarSign;
      case 'cash':
        return DollarSign;
      case 'bank':
      case 'savings':
        return Building;
      default:
        return DollarSign;
    }
  };

  // Filter accounts
  const activeAccounts = accounts.filter(acc => acc.type !== 'savings' && acc.type !== 'bank').map(acc => ({
    id: acc.id,
    name: acc.name,
    balance: Number(acc.balance),
    icon: getAccountIcon(acc.type),
    type: acc.type,
  }));

  const savingsAccountData = accounts.find(acc => acc.type === 'savings' || acc.type === 'bank');
  
  const savingsAccount = savingsAccountData ? {
    id: savingsAccountData.id,
    name: savingsAccountData.name,
    balance: Number(savingsAccountData.balance),
    icon: Building,
  } : null;

  const totalUsable = activeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalSavings = savingsAccount?.balance || 0;
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
        <CreditCardFront cardNumber={userPhone} holderName={userName} />
      </div>

      <div className="rounded-lg bg-gray-50 p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Usable Money</p>
            <p className="text-xl font-bold text-gray-900">
              {loading ? "..." : `${totalUsable.toLocaleString()} XAF`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Worth</p>
            <p className="text-xl font-bold text-emerald-700">
              {loading ? "..." : `${totalNetWorth.toLocaleString()} XAF`}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Accounts</h2>
        {loading ? (
          <p>Loading accounts...</p>
        ) : (
          <div className="space-y-4">
            {activeAccounts.length > 0 ? (
              activeAccounts.map((account) => (
                <AccountCard key={account.id} {...account} />
              ))
            ) : (
              <p className="text-gray-500 italic">No active accounts found.</p>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Savings</h2>
        {savingsAccount ? (
          <div className="space-y-4">
            <AccountCard {...savingsAccount} isActive={false} />
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">Bank Account Info</p>
              <p className="text-xs text-blue-600 mt-1">
                This account is for savings only. Money can only be added through the "Save" transaction type.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No savings account found.</p>
        )}
      </div>
    </div>
  );
}