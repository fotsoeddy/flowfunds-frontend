// components/dashboard/RecentTransactions.tsx
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, PiggyBank } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: number;
  type: 'income' | 'expense' | 'save';
  amount: number;
  reason: string;
  date: string;
  category?: string;
  account_name?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const typeConfig = {
    income: {
      icon: ArrowUpRight,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      prefix: '+',
    },
    expense: {
      icon: ArrowDownLeft,
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      {transactions.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <ArrowUpRight className="h-6 w-6 text-gray-400" />
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
          {transactions.slice(0, 5).map((transaction) => {
            const config = typeConfig[transaction.type] || typeConfig['expense']; // fallback
            const Icon = config.icon;

            return (
              <div key={transaction.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`${config.bgColor} rounded-lg p-2`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.account_name || 'Account'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
                        {transaction.reason}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${config.color}`}>
                    {config.prefix}${Number(transaction.amount).toLocaleString()}
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