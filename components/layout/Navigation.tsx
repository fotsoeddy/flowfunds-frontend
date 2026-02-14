// components/layout/Navigation.tsx
'use client';

import { Home, PlusCircle, List, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/add', icon: PlusCircle, label: 'Add' },
  { href: '/transactions', icon: List, label: 'Transactions' },
  { href: '/accounts', icon: CreditCard, label: 'Accounts' },
];

export function Navigation() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white py-2">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 p-2"
            >
              <item.icon
                className={`h-5 w-5 ${
                  isActive ? 'text-emerald-600' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-emerald-600 font-medium' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="text-[9px] text-center text-gray-300 pb-1">
        Developed by <a href="https://github.com/fotseddy" target="_blank" rel="noopener noreferrer" className="text-emerald-600/50 hover:text-emerald-600 transition-colors">Eddy Steve</a>
      </div>
    </nav>
  );
}