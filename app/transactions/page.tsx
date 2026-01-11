// app/transactions/page.tsx
import { TransactionList } from '@/components/transactions/TransactionList';

export default function TransactionsPage() {
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