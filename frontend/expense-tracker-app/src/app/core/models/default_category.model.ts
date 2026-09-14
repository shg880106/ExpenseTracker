// Numeric values must stay in sync with the backend TransactionType enum.
export enum TransactionType {
  Income = 0,
  Expense = 1
}

export interface DefaultCategory {
  id: number;
  name: string;
  type: TransactionType;
}

export interface DefaultCategoryRequest {
  name: string;
  type: TransactionType;
}

export const DEFAULT_CATEGORY_TYPE_OPTIONS: { label: string; value: TransactionType }[] = [
  { label: 'Income', value: TransactionType.Income },
  { label: 'Expense', value: TransactionType.Expense }
];

export function getDefaultCategoryTypeLabel(type: TransactionType): string {
  return type === TransactionType.Income ? 'Income' : 'Expense';
}

export function getDefaultCategoryTypeSeverity(type: TransactionType): 'success' | 'danger' {
  return type === TransactionType.Income ? 'success' : 'danger';
}
