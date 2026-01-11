// components/accounts/AccountCard.tsx
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { AccountType } from '@/types/transaction';

interface AccountCardProps {
  id: AccountType;
  name: string;
  balance: number;
  icon: LucideIcon;
  isActive?: boolean;
}

export function AccountCard({ id, name, balance, icon: Icon, isActive = true }: AccountCardProps) {
  return (
    <Card className={`p-4 ${isActive ? '' : 'opacity-75'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 rounded-lg p-3">
            <Icon className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">
              {isActive ? 'Active account' : 'Savings account'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            {balance.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>
    </Card>
  );
}