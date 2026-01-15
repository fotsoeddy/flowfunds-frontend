// components/profile/UserInfoSection.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Phone, Edit2, Check, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function UserInfoSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.getProfile();
      setUserInfo(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.patch('/auth/me/', {
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                fetchProfile(); // Reset changes
              }}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Picture Section - Simplified for now */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-emerald-600 bg-gray-100">
              <div className="relative h-full w-full flex items-center justify-center">
                <User className="h-16 w-16 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* User Info Fields */}
        <div className="space-y-2">
          <Label htmlFor="first_name" className="flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4" />
            First Name
          </Label>
          <Input
            id="first_name"
            value={userInfo.first_name || ''}
            onChange={(e) => setUserInfo({ ...userInfo, first_name: e.target.value })}
            disabled={!isEditing}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className="flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4" />
            Last Name
          </Label>
          <Input
            id="last_name"
            value={userInfo.last_name || ''}
            onChange={(e) => setUserInfo({ ...userInfo, last_name: e.target.value })}
            disabled={!isEditing}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={userInfo.phone_number || ''}
            readOnly
            disabled
            className="h-12 bg-gray-50 text-gray-500"
          />
        </div>
      </div>
    </Card>
  );
}
