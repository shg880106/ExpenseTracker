// Numeric values must stay in sync with the backend TransactionType enum.
export enum TransactionType {
  Income = 0,
  Expense = 1
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
}

export interface CategoryRequest {
  name: string;
  type: TransactionType;
}

export const CATEGORY_TYPE_OPTIONS: { label: string; value: TransactionType }[] = [
  { label: 'Income', value: TransactionType.Income },
  { label: 'Expense', value: TransactionType.Expense }
];

export function getCategoryTypeLabel(type: TransactionType): string {
  return type === TransactionType.Income ? 'Income' : 'Expense';
}

export function getCategoryTypeSeverity(type: TransactionType): 'success' | 'danger' {
  return type === TransactionType.Income ? 'success' : 'danger';
}
