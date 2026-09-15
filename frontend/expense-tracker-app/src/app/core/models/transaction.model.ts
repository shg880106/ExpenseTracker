export enum TransactionType {
  Income = 0,
  Expense = 1
}

export interface Transaction {
  id: number;
  amount: number;
  date: Date;
  description?: string;
  type: TransactionType;
  categoryId: number;
}

export interface TransactionRequest {
  amount: number;
  date: Date;
  description?: string;
  type: TransactionType;
  categoryId: number;
}

export const TRANSACTION_TYPE_OPTIONS: { label: string; value: TransactionType }[] = [
  { label: 'Income', value: TransactionType.Income },
  { label: 'Expense', value: TransactionType.Expense }
];

export function getTransactionTypeLabel(type: TransactionType): string {
  return type === TransactionType.Income ? 'Income' : 'Expense';
}

export function getTransactionTypeSeverity(type: TransactionType): 'success' | 'danger' {
  return type === TransactionType.Income ? 'success' : 'danger';
}