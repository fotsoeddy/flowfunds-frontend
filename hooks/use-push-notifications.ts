"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
      if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
      }
  };

  const subscribeToNotifications = async (manual = false) => {
    if (!('serviceWorker' in navigator)) {
        toast.error("Service workers are not supported in this browser");
        return;
    }

    setLoading(true);

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered:', registration);

        if (Notification.permission === 'denied') {
            if (manual) {
                toast.error("Notifications are blocked", {
                    description: "Please enable them in your browser settings (click the lock icon in address bar).",
                    duration: 5000,
                });
            }
            // Removed automatic toast as per user request
            setPermission('denied');
            setLoading(false);
            return;
        }

        // Request permission
        const perm = await Notification.requestPermission();
        setPermission(perm);

        if (perm === 'granted') {
            const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!publicKey) {
                console.error('VAPID key missing');
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

            // Send to backend
            const subJSON = subscription.toJSON();
            await api.savePushSubscription({
                endpoint: subJSON.endpoint,
                p256dh: subJSON.keys?.p256dh,
                auth: subJSON.keys?.auth
            });

            setIsSubscribed(true);
            console.log('Push notification subscribed!');
            if (manual) toast.success("Notifications enabled successfully!");
        } else {
            if (manual) toast.info("Permission was ignored");
        }

    } catch (error) {
        console.error('Subscription failed:', error);
        toast.error("Failed to enable notifications");
    } finally {
        setLoading(false);
    }
  };

  return {
    permission,
    isSubscribed,
    loading,
    subscribeToNotifications
  };
}
