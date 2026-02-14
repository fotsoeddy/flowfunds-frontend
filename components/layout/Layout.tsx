"use client";
// components/layout/Layout.tsx
import { Header } from './Header';
import { Navigation } from './Navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import api from '@/lib/api';
import { useEffect } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
 
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  /* 
     Logic moved to usePushNotifications hook. 
     We still want to trigger the initial check/auto-subscribe on mount (non-manual).
  */
  const { subscribeToNotifications } = usePushNotifications();

  useEffect(() => {
    if (!isAuthPage) {
        subscribeToNotifications(false); // false = not manual, so it won't toast success but will toast denied limit
    }
  }, [isAuthPage]);

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col">
      <Header />
      <main className={cn("flex-1 flex flex-col", !isAuthPage ? "pb-24" : "")}>{children}</main>
      <Navigation />
      <Toaster richColors />
    </div>
  );
}