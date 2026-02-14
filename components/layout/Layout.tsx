"use client";
// components/layout/Layout.tsx
import { Header } from './Header';
import { Navigation } from './Navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col">
      {!isAuthPage && <Header />}
      <main className={cn("flex-1", !isAuthPage ? "pb-24" : "")}>{children}</main>
      {!isAuthPage && (
        <footer className="pb-20 text-center text-[10px] text-gray-400">
          Developed by <a href="https://github.com/fotseddy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Eddy Steve</a>
        </footer>
      )}
      <Navigation />
    </div>
  );
}