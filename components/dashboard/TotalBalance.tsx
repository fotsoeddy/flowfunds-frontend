// components/dashboard/TotalBalance.tsx
import { Card } from '@/components/ui/card';

interface TotalBalanceProps {
  total: number;
}

export function TotalBalance({ total }: TotalBalanceProps) {
  return (
    <Card className="bg-emerald-50 border-emerald-100">
      <div className="p-6">
        <p className="text-sm font-medium text-emerald-700">Total Usable Money</p>
        <p className="text-3xl font-bold text-emerald-900">
          {total.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
          })}
        </p>
        <p className="mt-2 text-sm text-emerald-600">
          Across all active accounts
        </p>
      </div>
    </Card>
  );
}