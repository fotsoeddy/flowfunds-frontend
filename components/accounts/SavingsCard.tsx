// components/accounts/SavingsCard.tsx
import { Card } from '@/components/ui/card';
import { Building, TrendingUp, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SavingsCardProps {
  balance: number;
  monthlyGoal?: number;
  progress?: number;
}

export function SavingsCard({ balance, monthlyGoal = 500, progress = 65 }: SavingsCardProps) {
  const formattedBalance = balance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  return (
    <Card className="border-blue-100 bg-blue-50 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-3">
              <Building className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900">Bank Savings</h3>
              <p className="text-sm text-blue-700">Secure & growing</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-900">{formattedBalance}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Monthly Goal</span>
              <span className="text-sm text-blue-700">{progress}%</span>
            </div>
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-blue-600 mt-2">
              ${monthlyGoal} target • ${(monthlyGoal * (progress/100)).toFixed(0)} saved
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Lock className="h-4 w-4" />
            <span>Savings-only account • Withdrawals disabled</span>
          </div>

          <div className="pt-4 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-gray-600">+12% from last month</span>
              </div>
              <Link href="/add">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Add Savings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}