// app/page.tsx (Dashboard)
import { DollarSign, Smartphone, CircleDollarSign } from 'lucide-react';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { TotalBalance } from '@/components/dashboard/TotalBalance';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  // Mock data
  const accounts = [
    {
      title: 'Cash',
      balance: 1250,
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'MoMo',
      balance: 875,
      icon: Smartphone,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Orange Money',
      balance: 420,
      icon: CircleDollarSign,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const totalUsable = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Track your finances in real-time</p>
      </div>

      <div className="grid gap-4 mb-8">
        {accounts.map((account) => (
          <BalanceCard key={account.title} {...account} />
        ))}
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
        <RecentTransactions />
      </div>

      <Link href="/add">
        <Button className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}