// components/layout/Layout.tsx
import { Header } from './Header';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-white">
      <Header />
      <main className="pb-16">{children}</main>
      <Navigation />
    </div>
  );
}