// components/layout/Header.tsx
'use client';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';

export function Header() {
  const { data: user } = useAuth();
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const displayName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'User';

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
              <span className="text-sm font-semibold text-gray-900">{displayName}</span>
              <span className="text-xs text-gray-500">View Profile</span>
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-emerald-600 bg-gray-100">
              <div className="relative h-full w-full">
                <User className="h-full w-full p-2 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}