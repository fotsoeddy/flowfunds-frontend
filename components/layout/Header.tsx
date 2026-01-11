// components/layout/Header.tsx
import { Wallet, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
            <Wallet className="h-6 w-6 text-emerald-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">FlowFunds</span>
        </div>
        
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}