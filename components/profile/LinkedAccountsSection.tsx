// components/profile/LinkedAccountsSection.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getCarrierFromNumber } from '@/lib/utils';

interface LinkedAccount {
  id: string;
  type: 'momo' | 'om' | 'cash';
  phoneNumber: string; // From backend 'number'
  isPrimary: boolean;
  label?: string; // From backend 'name'
}

export function LinkedAccountsSection() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State for Add Account
  const [newAccount, setNewAccount] = useState({
    phoneNumber: '',
    label: '',
    initialBalance: '',
  });

  // State for Delete Confirmation
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.getAccounts();
      // Map backend response to local interface
      // Assuming backend returns list of { id, name, number, type, ... }
      const mappedAccounts = response.data.map((acc: any) => ({
        id: acc.id,
        type: acc.type,
        phoneNumber: acc.number,
        isPrimary: acc.is_primary, // Use backend flag directly
        label: acc.name,
      }));
      setAccounts(mappedAccounts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      toast.error('Failed to load linked accounts');
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    const carrier = getCarrierFromNumber(newAccount.phoneNumber);
    if (!carrier) {
      toast.error('Invalid Cameroon phone number or unsupported carrier');
      return;
    }

    try {
      // Assuming backend create endpoint: POST /accounts/
      // Requires: name, number, type, initial_balance
      const payload = {
        name: newAccount.label || (carrier === 'momo' ? 'MoMo Account' : 'Orange Money Account'),
        number: newAccount.phoneNumber,
        type: carrier,
        initial_balance: Number(newAccount.initialBalance) || 0, // Default 0 as per requirement inference
      };

      await api.post('/accounts/', payload);
      toast.success('Account added successfully');
      setNewAccount({ phoneNumber: '', label: '', initialBalance: '' });
      setIsDialogOpen(false);
      fetchAccounts(); // Refresh list
    } catch (error) {
      console.error('Failed to add account:', error);
      toast.error('Failed to add account');
    }
  };

  const confirmDelete = (account: LinkedAccount) => {
    if (account.isPrimary) {  // Frontend check if IS Primary flag exists
       toast.error("Cannot delete primary account.");
       return;
    }
    // Also prevent deletion if it's the "Cash" account, generally kept as default
    if (account.type === 'cash') {
       toast.error("Cannot delete default Cash account.");
       return;
    }
    
    // Check if it matches user's primary phone (alternative check)
    // For now, let's rely on the explicit checks we want. 
    // If backend restricts, it will error. Frontend modal is a safety net.
    setAccountToDelete(account.id);
  };

  const handleRemoveAccount = async () => {
    if (!accountToDelete) return;

    try {
      // Assuming backend delete endpoint: DELETE /accounts/<id>/
      await api.delete(`/accounts/${accountToDelete}/`);
      toast.success('Account removed successfully');
      setAccountToDelete(null);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to remove account:', error);
      toast.error('Failed to remove account');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

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
                Enter account details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  placeholder="237 6XX XX XX XX"
                  value={newAccount.phoneNumber}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, phoneNumber: e.target.value })
                  }
                  className="h-12"
                />
              </div>

               <div className="space-y-2">
                <Label htmlFor="initial-balance">Initial Balance (Optional)</Label>
                <Input
                  id="initial-balance"
                  type="number"
                  placeholder="0"
                  value={newAccount.initialBalance}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, initialBalance: e.target.value })
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

      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the linked account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveAccount} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          {/* Empty state content */}
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
                  {(account.type === 'momo' || account.type === 'om') && (
                     <Image
                     src={account.type === 'momo' ? '/momo_logo.png' : '/om_logo.png'}
                     alt={account.type === 'momo' ? 'MoMo' : 'Orange Money'}
                     fill
                     className="object-contain"
                   />
                  )}
                  {account.type === 'cash' && (
                     <Image
                     src="/cash.png"
                     alt="Cash"
                     fill
                     className="object-contain"
                   />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {account.type === 'momo' ? 'MTN Mobile Money' : account.type === 'om' ? 'Orange Money' : account.type === 'cash' ? 'Cash Account' : account.type}
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => confirmDelete(account)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  disabled={account.type === 'cash' || account.isPrimary} // Explicitly disable for Cash and Primary
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
