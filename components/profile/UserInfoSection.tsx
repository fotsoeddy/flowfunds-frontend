// components/profile/UserInfoSection.tsx
'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Edit2, Check, X } from 'lucide-react';

export function UserInfoSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Eddy Fotso',
    email: 'eddy@example.com',
    phone: '+237 6 XX XX XX XX',
  });

  const handleSave = () => {
    // In real app, save to backend
    setIsEditing(false);
  };

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
              onClick={() => setIsEditing(false)}
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
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-emerald-600 bg-gray-100">
              <div className="relative h-full w-full flex items-center justify-center">
                <User className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            {isEditing && (
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition-colors"
              >
                <Edit2 className="h-4 w-4 text-white" />
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    // Handle image upload
                    console.log('Image selected:', e.target.files?.[0]);
                  }}
                />
              </label>
            )}
          </div>
          {isEditing && (
            <p className="text-sm text-gray-600">Click the icon to upload a new photo</p>
          )}
        </div>

        {/* User Info Fields */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4" />
            Full Name
          </Label>
          <Input
            id="name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            disabled={!isEditing}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
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
            value={userInfo.phone}
            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            disabled={!isEditing}
            className="h-12"
          />
        </div>
      </div>
    </Card>
  );
}
