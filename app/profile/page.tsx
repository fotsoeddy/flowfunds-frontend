// app/profile/page.tsx
import { UserInfoSection } from '@/components/profile/UserInfoSection';
import { LinkedAccountsSection } from '@/components/profile/LinkedAccountsSection';
import { SecuritySection } from '@/components/profile/SecuritySection';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <UserInfoSection />
          <LinkedAccountsSection />
          <SecuritySection />
        </div>
      </div>
    </div>
  );
}
