"use client";
// components/layout/Layout.tsx
import { Header } from './Header';
import { Navigation } from './Navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import api from '@/lib/api';

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

  useEffect(() => {
    if ('serviceWorker' in navigator && !isAuthPage) {
      const registerSW = async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('SW registered:', registration);

            // Request permission
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!publicKey) {
                    console.error('VAPID public key not found');
                    return;
                }

                const convertedVapidKey = urlBase64ToUint8Array(publicKey);
                let subscription = await registration.pushManager.getSubscription();

                if (!subscription) {
                    subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey
                    });
                }
                
                // Send subscription to backend
                const subJSON = subscription.toJSON();
                await api.savePushSubscription({
                    endpoint: subJSON.endpoint,
                    p256dh: subJSON.keys?.p256dh,
                    auth: subJSON.keys?.auth
                });
                console.log('Push notification subscribed!');
            }
        } catch (error) {
            console.error('SW registration failed:', error);
        }
      };
      registerSW();
    }
  }, [isAuthPage]);

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col">
      <Header />
      <main className={cn("flex-1 flex flex-col", !isAuthPage ? "pb-24" : "")}>{children}</main>
      <Navigation />
    </div>
  );
}