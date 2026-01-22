// components/dashboard/TotalBalance.tsx
import { Card } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TotalBalanceProps {
  total: number;
}

export function TotalBalance({ total }: TotalBalanceProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Card className="bg-emerald-50 border-emerald-100">
      <div className="p-6">
        <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-emerald-700">Total Usable Money</p>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
                onClick={() => setIsVisible(!isVisible)}
            >
                {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
        </div>
        <p className="text-3xl font-bold text-emerald-900 mt-2">
          {isVisible ? total.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
          }) : '***'}
        </p>
        <p className="mt-2 text-sm text-emerald-600">
          Across all active accounts
        </p>
      </div>
    </Card>
  );
}