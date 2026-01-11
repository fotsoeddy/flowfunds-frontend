// components/dashboard/BalanceCard.tsx
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import Image from 'next/image';

interface BalanceCardProps {
  title: string;
  balance: number;
  icon?: LucideIcon;
  iconColor?: string;
  bgColor: string;
  imageSrc?: string;
}

export function BalanceCard({ title, balance, icon: Icon, iconColor, bgColor, imageSrc }: BalanceCardProps) {
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
        <div className={imageSrc ? 'rounded-lg p-3' : `${bgColor} rounded-lg p-3`}>
          {imageSrc ? (
            <div className="h-8 w-8 relative">
              <Image src={imageSrc} alt={title} fill className="object-contain" />
            </div>
          ) : Icon ? (
            <Icon className={`h-6 w-6 ${iconColor}`} />
          ) : null}
        </div>
      </div>
    </Card>
  );
}