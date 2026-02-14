// components/dashboard/TotalBalance.tsx
import { Card } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TotalBalanceProps {
  total: number;
  netWorth: number;
}

export function TotalBalance({ total, netWorth }: TotalBalanceProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Card className="bg-emerald-50 border-emerald-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Financial Overview</p>
              <h3 className="text-lg font-bold text-emerald-900">Total Balance</h3>
            </div>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded-full"
                onClick={() => setIsVisible(!isVisible)}
            >
                {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-emerald-700/80">Usable Money</p>
            <p className="text-xl font-bold text-emerald-900">
              {isVisible ? total.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'XAF',
                minimumFractionDigits: 0,
              }) : '***'}
            </p>
          </div>
          <div className="space-y-1 border-l border-emerald-200 pl-4">
            <p className="text-xs font-medium text-emerald-700/80">Net Worth</p>
            <p className="text-xl font-bold text-emerald-600">
              {isVisible ? netWorth.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'XAF',
                minimumFractionDigits: 0,
              }) : '***'}
            </p>
          </div>
        </div>
        
        <p className="mt-4 text-[10px] text-emerald-600/70 italic">
          * Usable money excludes savings accounts.
        </p>
      </div>
    </Card>
  );
}