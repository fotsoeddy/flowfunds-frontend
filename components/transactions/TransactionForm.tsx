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
import { ArrowUpCircle, ArrowDownCircle, PiggyBank, DollarSign } from 'lucide-react';
import { TransactionType, AccountType } from '@/types/transaction';
import Image from 'next/image';

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

  const typeConfig = {
    income: {
      icon: ArrowUpCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      label: 'Income',
    },
    expense: {
      icon: ArrowDownCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      label: 'Expense',
    },
    save: {
      icon: PiggyBank,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Save',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="container px-4 py-8 max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
            <Icon className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Add {config.label}</h1>
          <p className="text-gray-600 mt-2">Track your financial activity</p>
        </div>
        
        {/* Type Selector */}
        <Card className="p-2 mb-6">
          <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)} className="w-full">
            <TabsList className="grid grid-cols-3 w-full h-auto p-1">
              <TabsTrigger 
                value="income" 
                className="flex flex-col items-center gap-2 py-3"
              >
                <ArrowUpCircle className="h-5 w-5" />
                <span className="text-xs font-medium">Income</span>
              </TabsTrigger>
              <TabsTrigger 
                value="expense" 
                className="flex flex-col items-center gap-2 py-3"
              >
                <ArrowDownCircle className="h-5 w-5" />
                <span className="text-xs font-medium">Expense</span>
              </TabsTrigger>
              <TabsTrigger 
                value="save" 
                className="flex flex-col items-center gap-2 py-3"
              >
                <PiggyBank className="h-5 w-5" />
                <span className="text-xs font-medium">Save</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Form Card */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-base font-semibold text-gray-700">
                Amount (CFA)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="pl-10 text-2xl font-bold h-14 border-2 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Account Selector */}
            <div className="space-y-3">
              <Label htmlFor="account" className="text-base font-semibold text-gray-700">
                {type === 'save' ? 'From Account' : 'Account'}
              </Label>
              <Select value={account} onValueChange={(v) => setAccount(v as AccountType)}>
                <SelectTrigger className="h-12 border-2">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 relative">
                        <Image src="/cash.png" alt="Cash" fill className="object-contain" />
                      </div>
                      <span className="font-medium">Cash</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="momo">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 relative">
                        <Image src="/momo_logo.png" alt="MoMo" fill className="object-contain" />
                      </div>
                      <span className="font-medium">MoMo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="om">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 relative">
                        <Image src="/om_logo.png" alt="Orange Money" fill className="object-contain" />
                      </div>
                      <span className="font-medium">Orange Money</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category (Expense only) */}
            {type === 'expense' && (
              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-semibold text-gray-700">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 border-2">
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
            )}

            {/* Reason */}
            <div className="space-y-3">
              <Label htmlFor="reason" className="text-base font-semibold text-gray-700">
                Description
              </Label>
              <Input
                id="reason"
                placeholder={
                  type === 'income' 
                    ? 'Salary, Freelance, Gift...' 
                    : type === 'save'
                    ? 'Vacation, Emergency Fund...'
                    : 'What was this for?'
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="h-12 border-2"
              />
            </div>

            {/* Save Info Banner */}
            {type === 'save' && (
              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <PiggyBank className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Destination: Bank (Savings)
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Savings automatically go to your bank account
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700"
            >
              Add {config.label}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}