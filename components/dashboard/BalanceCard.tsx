// components/dashboard/BalanceCard.tsx
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  balance: number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

export function BalanceCard({ title, balance, icon: Icon, iconColor, bgColor }: BalanceCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {balance.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'XAF',
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
        <div className={`${bgColor} rounded-lg p-3`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}