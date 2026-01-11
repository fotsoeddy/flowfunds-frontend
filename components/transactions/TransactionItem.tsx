// components/transactions/TransactionItem.tsx
import { ArrowUpCircle, ArrowDownCircle, PiggyBank } from 'lucide-react';
import { TransactionType, AccountType } from '@/types/transaction';

interface TransactionItemProps {
  type: TransactionType;
  amount: number;
  account: AccountType;
  reason: string;
  date: Date;
  category?: string;
}

export function TransactionItem({
  type,
  amount,
  account,
  reason,
  date,
  category,
}: TransactionItemProps) {
  const formatAccount = (acc: AccountType) => {
    const names: Record<AccountType, string> = {
      cash: 'Cash',
      momo: 'MoMo',
      om: 'Orange Money',
      bank: 'Bank',
    };
    return names[acc];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

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

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between py-3 px-1 border-b">
      <div className="flex items-center gap-3">
        <div className={`${config.bgColor} rounded-lg p-2`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{reason}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
              {formatAccount(account)}
            </span>
            {category && (
              <span className="text-xs text-gray-500">• {category}</span>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${config.color}`}>
          {config.prefix}${amount.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mt-1">{formatDate(date)}</p>
      </div>
    </div>
  );
}