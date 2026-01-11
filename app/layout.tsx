// app/layout.tsx (updated)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Layout } from '@/components/layout/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlowFunds - Personal Finance Tracker',
  description: 'Track your income, expenses, and savings effortlessly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}