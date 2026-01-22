"use client";

import { DollarSign, Smartphone, CircleDollarSign, Building, LogOut } from 'lucide-react';
import { AccountCard } from '@/components/accounts/AccountCard';
import { CreditCardFront } from '@/components/dashboard/CreditCardFront';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useAccounts } from '@/hooks/use-accounts';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

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
  const { data: user, isLoading: isUserLoading } = useAuth();
  const { data: accountsData, isLoading: isAccountsLoading } = useAccounts();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  
  const accounts = accountsData || [];
  const loading = isUserLoading || isAccountsLoading || isTransactionsLoading;

  const userPhone = user?.phone_number || "";
  const userName = user ? `${user.first_name} ${user.last_name}` : "";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        // Fetch transactions for the graph
        api.getTransactions()
            .then((res: any) => {
                setTransactions(res.data);
                setIsTransactionsLoading(false);
            })
            .catch((err: any) => {
                console.error("Failed to fetch transactions", err);
                setIsTransactionsLoading(false);
            });
      }
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  
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

  // Process data for the graph
  const graphData = useMemo(() => {
    const dataMap = new Map<string, { date: string, income: number, expense: number }>();

    transactions.forEach(t => {
       const dateArr = new Date(t.date).toDateString().split(' ');
       // Format: "Mon Jan 01" -> "Jan 01"
       const dateKey = `${dateArr[1]} ${dateArr[2]}`; 
       
       if (!dataMap.has(dateKey)) {
           dataMap.set(dateKey, { date: dateKey, income: 0, expense: 0 });
       }
       
       const entry = dataMap.get(dateKey)!;
       const amount = Number(t.amount);

       if (t.type === 'income') {
           entry.income += amount;
       } else if (t.type === 'expense') {
           entry.expense += amount;
       }
    });

    // Convert map to array and sort by date (simple sort for now, assuming recent dates)
    // For a robust sort we might need the original timestamp
    return Array.from(dataMap.values()).reverse(); // API returns most recent first, so reverse for graph
  }, [transactions]);


  if (!isAuthenticated) return null;

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

      {/* Graph Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Income vs Expense</h2>
        <div className="h-64 w-full bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
            {isTransactionsLoading ? (
                <div className="h-full flex items-center justify-center text-gray-400">Loading graph...</div>
            ) : graphData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis 
                            hide={true} 
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#F3F4F6' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                        <Bar 
                            name="Income"
                            dataKey="income" 
                            fill="#10B981" 
                            radius={[4, 4, 0, 0]} 
                            barSize={20}
                        />
                        <Bar 
                            name="Expense"
                            dataKey="expense" 
                            fill="#EF4444" 
                            radius={[4, 4, 0, 0]} 
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
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