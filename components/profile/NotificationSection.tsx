"use client";

import { Bell, BellOff, Loader2 } from 'lucide-react';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { cn } from '@/lib/utils';

export function NotificationSection() {
  const { permission, isSubscribed, loading, subscribeToNotifications } = usePushNotifications();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className={cn(
            "p-3 rounded-xl",
            isSubscribed ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
          )}>
            {isSubscribed ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Push Notifications</h2>
            <p className="text-sm text-gray-500 mt-1">
              {isSubscribed 
                ? "You are receiving daily insights and reminders." 
                : "Enable notifications to get AI-powered daily insights."}
            </p>
            {permission === 'denied' && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                    Notifications are blocked. Please enable them in your browser settings.
                </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
            onClick={() => subscribeToNotifications(true)}
            disabled={loading || (isSubscribed && permission === 'granted')}
            className={cn(
                "w-full py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                isSubscribed 
                    ? "bg-gray-100 text-gray-400 cursor-default" 
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200"
            )}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubscribed ? "Notifications Active" : "Enable Internal Notifications"}
        </button>
      </div>
    </div>
  );
}
