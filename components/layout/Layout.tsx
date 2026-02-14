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
      <main className="pb-24">{children}</main>
      <footer className="pb-20 text-center text-[10px] text-gray-400">
        Developed by <a href="https://github.com/fotseddy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Eddy Steve</a>
      </footer>
      <Navigation />
    </div>
  );
}