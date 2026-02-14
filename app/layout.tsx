// app/layout.tsx (updated)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Layout } from '@/components/layout/Layout';
import { ReactQueryProvider } from '@/lib/react-query-provider';

import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlowFunds - Personal Finance Tracker',
  description: 'Track your income, expenses, and savings effortlessly',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo/logo.svg',
    shortcut: '/logo/logo_no_bg.png',
    apple: '/logo/logo.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FlowFunds',
  },
};

export const viewport = {
  themeColor: '#10B981',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <ReactQueryProvider>
          <Layout>{children}</Layout>
        </ReactQueryProvider>
      </body>
    </html>
  );
}