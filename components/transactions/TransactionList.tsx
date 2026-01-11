// components/transactions/TransactionList.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpCircle, ArrowDownCircle, PiggyBank, Search, Filter } from 'lucide-react';

interface Transaction {
  id: number;
  type: 'income' | 'expense' | 'save';
  amount: number;
  account: 'cash' | 'momo' | 'om';
  reason: string;
  date: Date;
  category?: string;
}

export function TransactionList() {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'save'>('all');
  const [search, setSearch] = useState('');

  // Mock data
  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'expense',
      amount: 45.99,
      account: 'momo',
      reason: 'Grocery shopping',
      date: new Date('2024-01-15'),
      category: 'Food',
    },
    {
      id: 2,
      type: 'income',
      amount: 1200,
      account: 'cash',
      reason: 'Freelance payment',
      date: new Date('2024-01-14'),
    },
    {
      id: 3,
      type: 'save',
      amount: 200,
      account: 'om',
      reason: 'Emergency fund',
      date: new Date('2024-01-13'),
    },
    {
      id: 4,
      type: 'expense',
      amount: 25.5,
      account: 'cash',
      reason: 'Coffee with friends',
      date: new Date('2024-01-12'),
      category: 'Food',
    },
    {
      id: 5,
      type: 'expense',
      amount: 89.99,
      account: 'momo',
      reason: 'Amazon purchase',
      date: new Date('2024-01-11'),
      category: 'Shopping',
    },
    {
      id: 6,
      type: 'income',
      amount: 500,
      account: 'momo',
      reason: 'Client project',
      date: new Date('2024-01-10'),
    },
    {
      id: 7,
      type: 'save',
      amount: 150,
      account: 'cash',
      reason: 'Vacation fund',
      date: new Date('2024-01-09'),
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter !== 'all' && transaction.type !== filter) return false;
    if (search && !transaction.reason.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const typeConfig = {
    income: {
      icon: ArrowUpCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      prefix: '+',
      label: 'Income',
    },
    expense: {
      icon: ArrowDownCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      prefix: '-',
      label: 'Expense',
    },
    save: {
      icon: PiggyBank,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      prefix: '→',
      label: 'Save',
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
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[120px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="save">Save</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTransactions.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-600">
            Try adjusting your search or filter
          </p>
        </Card>
      ) : (
        <Card>
          <div className="divide-y">
            {filteredTransactions.map((transaction) => {
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
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${config.color}`}>
                      {config.prefix}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {transaction.type}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Total Balance</p>
            <p className="text-2xl font-bold text-emerald-700">
              $1,789.50
            </p>
          </div>
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}