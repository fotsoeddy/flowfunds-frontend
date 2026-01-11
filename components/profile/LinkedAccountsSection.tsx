// components/profile/LinkedAccountsSection.tsx
'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Star } from 'lucide-react';
import Image from 'next/image';

interface LinkedAccount {
  id: string;
  type: 'momo' | 'om';
  phoneNumber: string;
  isPrimary: boolean;
  label?: string;
}

export function LinkedAccountsSection() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([
    {
      id: '1',
      type: 'momo',
      phoneNumber: '+237 6 XX XX XX XX',
      isPrimary: true,
      label: 'Personal',
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    type: 'momo' as 'momo' | 'om',
    phoneNumber: '',
    label: '',
  });

  const handleAddAccount = () => {
    const account: LinkedAccount = {
      id: Date.now().toString(),
      type: newAccount.type,
      phoneNumber: newAccount.phoneNumber,
      isPrimary: accounts.length === 0,
      label: newAccount.label,
    };
    setAccounts([...accounts, account]);
    setNewAccount({ type: 'momo', phoneNumber: '', label: '' });
    setIsDialogOpen(false);
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  const handleSetPrimary = (id: string) => {
    setAccounts(
      accounts.map((acc) => ({
        ...acc,
        isPrimary: acc.id === id,
      }))
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Linked Accounts</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your MoMo and Orange Money accounts
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Account</DialogTitle>
              <DialogDescription>
                Link a new MoMo or Orange Money account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select
                  value={newAccount.type}
                  onValueChange={(value: 'momo' | 'om') =>
                    setNewAccount({ ...newAccount, type: value })
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="momo">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 relative">
                          <Image src="/momo_logo.png" alt="MoMo" fill className="object-contain" />
                        </div>
                        <span>MTN Mobile Money</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="om">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 relative">
                          <Image src="/om_logo.png" alt="Orange Money" fill className="object-contain" />
                        </div>
                        <span>Orange Money</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  placeholder="+237 6XX XX XX XX"
                  value={newAccount.phoneNumber}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, phoneNumber: e.target.value })
                  }
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Label (Optional)</Label>
                <Input
                  id="label"
                  placeholder="e.g., Personal, Business"
                  value={newAccount.label}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, label: e.target.value })
                  }
                  className="h-12"
                />
              </div>

              <Button
                onClick={handleAddAccount}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
                disabled={!newAccount.phoneNumber}
              >
                Add Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Plus className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900">No linked accounts</h3>
          <p className="mt-1 text-sm text-gray-600">
            Add your first payment account to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 relative">
                  <Image
                    src={account.type === 'momo' ? '/momo_logo.png' : '/om_logo.png'}
                    alt={account.type === 'momo' ? 'MoMo' : 'Orange Money'}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {account.type === 'momo' ? 'MTN Mobile Money' : 'Orange Money'}
                    </p>
                    {account.isPrimary && (
                      <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-current" />
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{account.phoneNumber}</p>
                  {account.label && (
                    <p className="text-xs text-gray-500">{account.label}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!account.isPrimary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPrimary(account.id)}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Set Primary
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAccount(account.id)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  disabled={account.isPrimary && accounts.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
