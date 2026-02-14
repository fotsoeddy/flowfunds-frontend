// components/transactions/TransactionList.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, PiggyBank, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTransactions } from '@/hooks/use-transactions';
import { LogoLoader } from '@/components/ui/logo-loader';

export function TransactionList() {
  const { data: transactionsData, isLoading: loading } = useTransactions();
  const transactions = transactionsData || [];
  
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'save'>('all');
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const getAvailableMonths = () => {
    // If no transactions, return empty
    if (!transactions.length) return [];
    
    const months = new Set<string>();
    transactions.forEach(t => {
      if (t.date) {
        const monthYear = new Date(t.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        months.add(monthYear);
      }
    });
    return Array.from(months).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter !== 'all' && transaction.type !== filter) return false;
    
    if (search) {
      const searchLower = search.toLowerCase();
      const reasonsMatch = transaction.reason?.toLowerCase().includes(searchLower);
      if (!reasonsMatch) return false;
    }

    if (monthFilter !== 'all') {
      const transactionMonth = new Date(transaction.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (transactionMonth !== monthFilter) return false;
    }
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="h-5 w-5 text-emerald-600" />;
      case 'expense':
        return <ArrowDownLeft className="h-5 w-5 text-rose-600" />;
      case 'save':
        return (
          <div className="h-5 w-5 relative">
            <Image src="/logo/logo.png" alt="Savings" fill className="object-contain" />
          </div>
        );
      default:
        return <ArrowDownLeft className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-emerald-100';
      case 'expense':
        return 'bg-rose-100';
      case 'save':
        return 'bg-transparent'; // No background for savings
      default:
        return 'bg-gray-100';
    }
  };



  if (loading) {
     return (
       <div className="flex justify-center py-20">
         <LogoLoader size={60} />
       </div>
     );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
                placeholder="Search by reason..." 
                className="pl-9 bg-white"
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
        
         {/* Monthly Filter */}
         <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {getAvailableMonths().map((month) => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTransactions.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                 <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-600">
                Try adjusting your search or filter
              </p>
          </Card>
      ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getBgColor(transaction.type)}`}>
                      {getIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.account_name || 'Account'}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
                           {transaction.reason}
                         </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 
                      transaction.type === 'expense' ? 'text-rose-600' : 'text-blue-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {Number(transaction.amount).toLocaleString()} CFA
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
      )}
    </div>
  );
}