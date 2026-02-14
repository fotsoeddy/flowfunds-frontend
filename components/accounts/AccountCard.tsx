// components/accounts/AccountCard.tsx
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { AccountType } from '@/types/transaction';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AccountCardProps {
  id: string;
  name: string;
  balance: number;
  icon: LucideIcon;
  isActive?: boolean;
  type?: string;
}

export function AccountCard({ id, name, balance, icon: Icon, isActive = true, type }: AccountCardProps) {
  const accountType = type || id; // Fallback to id if type not provided (legacy)
  const isBranded = ['momo', 'om', 'cash', 'savings'].includes(accountType || '');

  return (
    <Card className={cn("p-4 transition-all", isActive ? '' : 'opacity-75')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "rounded-lg p-3 relative h-12 w-12 flex items-center justify-center",
            isBranded && accountType === 'savings' ? 'bg-transparent' : 'bg-gray-100'
          )}>
            {accountType === 'cash' ? (
              <div className="h-6 w-6 relative">
                <Image src="/cash.png" alt="Cash" fill className="object-contain" />
              </div>
            ) : accountType === 'momo' ? (
              <div className="h-6 w-6 relative">
                <Image src="/momo_logo.png" alt="MoMo" fill className="object-contain" />
              </div>
            ) : accountType === 'om' ? (
              <div className="h-6 w-6 relative">
                <Image src="/om_logo.png" alt="Orange Money" fill className="object-contain" />
              </div>
            ) : accountType === 'savings' ? (
              <div className="h-8 w-8 relative">
                <Image src="/logo/logo.png" alt="Savings" fill className="object-contain" />
              </div>
            ) : (
              <Icon className="h-6 w-6 text-gray-700" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">
              {accountType === 'savings' ? 'Savings account' : isActive ? 'Active account' : 'Inactive account'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            {balance.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'XAF',
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>
    </Card>
  );
}