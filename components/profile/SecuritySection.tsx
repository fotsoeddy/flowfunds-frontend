// components/profile/SecuritySection.tsx
'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff } from 'lucide-react';

export function SecuritySection() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, validate and send to backend
    console.log('Changing password...');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Security
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage your password and security settings
        </p>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="h-12 pr-10"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({ ...showPasswords, current: !showPasswords.current })
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              className="h-12 pr-10"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({ ...showPasswords, new: !showPasswords.new })
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="h-12 pr-10"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
          disabled={
            !passwords.current ||
            !passwords.new ||
            !passwords.confirm ||
            passwords.new !== passwords.confirm
          }
        >
          Change Password
        </Button>

        {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
          <p className="text-sm text-rose-600">Passwords do not match</p>
        )}
      </form>
    </Card>
  );
}
