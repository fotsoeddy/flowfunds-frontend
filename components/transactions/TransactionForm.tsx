// components/transactions/TransactionForm.tsx
import { useState, useEffect } from 'react';
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
import { ArrowLeft, Loader2, PiggyBank } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { toast } from 'sonner';

export function TransactionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    reason: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.getAccounts();
        setAccounts(response.data);
        if (response.data.length > 0) {
            setFormData(prev => ({ ...prev, accountId: response.data[0].id }));
        }
      } catch (error) {
        console.error('Failed to fetch accounts', error);
        toast.error('Failed to load accounts');
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
          type: formData.type,
          amount: Number(formData.amount),
          category: '', // clear category
          reason: formData.reason,
          account_id: formData.accountId,
          date: new Date(formData.date).toISOString(),
      };

      await api.createTransaction(payload);
      toast.success('Transaction added successfully');
      router.push('/transactions');
    } catch (error: any) {
      console.error('Transaction failed:', error);
      if (error.response?.data) {
          const message = typeof error.response.data === 'string' 
            ? error.response.data 
            : Object.values(error.response.data).flat().join(', ');
          toast.error(message || 'Failed to add transaction');
      } else {
          toast.error('Failed to add transaction');
      }
    } finally {
      setLoading(false);
    }
  };

  const getAccountImage = (type: string) => {
    switch (type) {
      case 'momo':
        return '/momo_logo.png';
      case 'om':
        return '/om_logo.png';
      default:
        return '/cash.png'; // cash.png exists
    }
  };

  const getSelectValue = () => {
    if (!formData.accountId) return null;
    const account = accounts.find(a => a.id.toString() === formData.accountId.toString());
    if (!account) return null;

    return (
       <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                    src={getAccountImage(account.type)}
                    alt={account.type}
                    fill
                    className="object-cover"
                />
            </div>
            <span>{account.name} - {account.balance.toLocaleString()} {account.currency}</span>
       </div>
    );
  };


  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Transaction</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'default' : 'outline'}
                className={formData.type === 'expense' ? 'bg-rose-600 hover:bg-rose-700' : ''}
                onClick={() => setFormData({ ...formData, type: 'expense' })}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={formData.type === 'income' ? 'default' : 'outline'}
                className={formData.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                onClick={() => setFormData({ ...formData, type: 'income' })}
              >
                Income
              </Button>
              <Button
                type="button"
                variant={formData.type === 'save' ? 'default' : 'outline'}
                className={formData.type === 'save' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                onClick={() => setFormData({ ...formData, type: 'save' })}
              >
                Savings
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => setFormData({ ...formData, accountId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account">
                     {getSelectValue()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 overflow-hidden rounded-full">
                            <Image 
                                src={getAccountImage(account.type)} 
                                alt={account.type}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span>{account.name} ({account.type}) - {account.balance.toLocaleString()} {account.currency}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason/Description</Label>
            <Input
              id="reason"
              placeholder="e.g., Lunch at restaurant"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

           {/* Save Info Banner */}
            {formData.type === 'save' && (
              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <PiggyBank className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Destination: Bank (Savings)
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Savings will be deducted from your chosen account.
                    </p>
                  </div>
                </div>
              </div>
            )}

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading || !formData.accountId}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Transaction'}
          </Button>
        </form>
      </Card>
    </div>
  );
}