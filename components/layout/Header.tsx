// components/layout/Header.tsx
'use client';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  // Mock user data - in real app, this would come from auth context
  const user = {
    name: 'Eddy Fotso',
    initials: 'EF',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {/* Using logo from public folder */}
          <div className="h-10 w-10 relative">
             <Image src="/logo/logo_no_bg.png" alt="FlowFunds Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-bold text-gray-900">FlowFunds</span>
        </Link>
        
        {/* User Avatar */}
        <Link href="/profile">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">{user.name}</span>
              <span className="text-xs text-gray-500">View Profile</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-semibold">
              {user.initials}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}