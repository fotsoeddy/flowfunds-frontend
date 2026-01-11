// components/layout/Header.tsx
import { Wallet, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Using logo from public folder */}
          <div className="h-10 w-10 relative">
             <Image src="/logo/logo_no_bg.png" alt="FlowFunds Logo" fill className="object-contain" />
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