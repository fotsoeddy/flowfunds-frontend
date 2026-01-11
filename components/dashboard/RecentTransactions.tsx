// components/dashboard/RecentTransactions.tsx
import { Card } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, PiggyBank } from 'lucide-react';
import Link from 'next/link';

export function RecentTransactions() {
  // Mock data
  const recentTransactions = [
    {
      id: 1,
      type: 'expense' as const,
      amount: 45.99,
      account: 'momo' as const,
      reason: 'Grocery shopping',
      date: new Date('2024-01-15'),
      category: 'Food',
    },
    {
      id: 2,
      type: 'income' as const,
      amount: 1200,
      account: 'cash' as const,
      reason: 'Freelance payment',
      date: new Date('2024-01-14'),
    },
    {
      id: 3,
      type: 'save' as const,
      amount: 200,
      account: 'om' as const,
      reason: 'Emergency fund',
      date: new Date('2024-01-13'),
    },
    {
      id: 4,
      type: 'expense' as const,
      amount: 25.5,
      account: 'cash' as const,
      reason: 'Coffee with friends',
      date: new Date('2024-01-12'),
      category: 'Food',
    },
  ];

  const typeConfig = {
    income: {
      icon: ArrowUpCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      prefix: '+',
    },
    expense: {
      icon: ArrowDownCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      prefix: '-',
    },
    save: {
      icon: PiggyBank,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      prefix: '→',
    },
  };

  const formatAccount = (acc: string) => {
    const names: Record<string, string> = {
      cash: 'Cash',
      momo: 'MoMo',
      om: 'Orange Money',
    };
    return names[acc] || acc;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      {recentTransactions.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <ArrowUpCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900">No transactions yet</h3>
          <p className="mt-1 text-sm text-gray-600">
            Add your first transaction to get started
          </p>
          <Link href="/add">
            <button className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              Add Transaction
            </button>
          </Link>
        </div>
      ) : (
        <div className="divide-y">
          {recentTransactions.map((transaction) => {
            const config = typeConfig[transaction.type];
            const Icon = config.icon;

            return (
              <div key={transaction.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`${config.bgColor} rounded-lg p-2`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.reason}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
                        {formatAccount(transaction.account)}
                      </span>
                      {transaction.category && (
                        <span className="text-xs text-gray-500">• {transaction.category}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${config.color}`}>
                    {config.prefix}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}