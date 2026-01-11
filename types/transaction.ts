// types/transaction.ts
export type TransactionType = 'income' | 'expense' | 'save';
export type AccountType = 'cash' | 'momo' | 'om' | 'bank';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  account: AccountType;
  category?: string;
  reason: string;
  date: Date;
}

export interface Account {
  id: AccountType;
  name: string;
  balance: number;
  isActive: boolean;
  icon: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  account: AccountType;
  category?: string;
  reason: string;
}