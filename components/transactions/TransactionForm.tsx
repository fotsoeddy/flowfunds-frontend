// components/transactions/TransactionForm.tsx
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ArrowUpCircle, ArrowDownCircle, PiggyBank } from 'lucide-react';
import { TransactionType, AccountType } from '@/types/transaction';

export function TransactionForm() {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState<AccountType>('cash');
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');

  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to backend
    console.log({ type, amount, account, category, reason });
    
    // Reset form
    setAmount('');
    setCategory('');
    setReason('');
  };

  return (
    <div className="container px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Transaction</h1>
      
      <Card className="p-6">
        <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="income" className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Income
            </TabsTrigger>
            <TabsTrigger value="expense" className="flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4" />
              Expense
            </TabsTrigger>
            <TabsTrigger value="save" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Save
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="income" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account">Account</Label>
                <Select value={account} onValueChange={(v) => setAccount(v as AccountType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="momo">MoMo</SelectItem>
                    <SelectItem value="om">Orange Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  placeholder="Salary, Freelance, Gift, etc."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="expense" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expense-account">Account</Label>
                <Select value={account} onValueChange={(v) => setAccount(v as AccountType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="momo">MoMo</SelectItem>
                    <SelectItem value="om">Orange Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase().replace(/ & /g, '-')}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expense-reason">Reason</Label>
                <Input
                  id="expense-reason"
                  placeholder="What was this for?"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="save" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="save-amount">Amount to Save</Label>
                <Input
                  id="save-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="save-from">From Account</Label>
                <Select value={account} onValueChange={(v) => setAccount(v as AccountType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="momo">MoMo</SelectItem>
                    <SelectItem value="om">Orange Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="save-reason">Reason</Label>
                <Input
                  id="save-reason"
                  placeholder="Vacation, Emergency Fund, etc."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
              
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-800">
                  Destination: <span className="font-bold">Bank (Savings)</span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Savings automatically go to your bank account
                </p>
              </div>
            </TabsContent>

            <Button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">
              Add Transaction
            </Button>
          </form>
        </Tabs>
      </Card>
    </div>
  );
}