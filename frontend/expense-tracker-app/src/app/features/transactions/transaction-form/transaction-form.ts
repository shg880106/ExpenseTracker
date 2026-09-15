import { Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { Category } from '../../../core/models/category.model';
import { TRANSACTION_TYPE_OPTIONS, Transaction, TransactionRequest, TransactionType } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputNumberModule, DatePickerModule, SelectModule, TextareaModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss'
})
export class TransactionForm {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly visible = input(false);
  readonly transaction = input<Transaction | null>(null);
  readonly categories = input<Category[]>([]);
  readonly saving = input(false);

  readonly visibleChange = output<boolean>();
  readonly save = output<TransactionRequest>();

  readonly typeOptions = TRANSACTION_TYPE_OPTIONS;

  readonly form = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: [new Date(), [Validators.required]],
    description: ['', [Validators.maxLength(200)]],
    type: [TransactionType.Expense, [Validators.required]],
    categoryId: [0, [Validators.required, Validators.min(1)]]
  });

  private readonly selectedType = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value
  });

  readonly categoryOptions = computed(() =>
    this.categories()
      .filter((category) => category.type === this.selectedType())
      .map((category) => ({ label: category.name, value: category.id }))
  );

  private wasVisible = false;

  constructor() {
    effect(() => {
      const transaction = this.transaction();
      const visible = this.visible();

      // Only reset when the dialog transitions from closed to open, not on every effect re-run.
      if (visible && !this.wasVisible) {
        this.form.reset({
          amount: transaction?.amount ?? 0,
          date: transaction ? fromApiDate(transaction.date) : new Date(),
          description: transaction?.description ?? '',
          type: transaction?.type ?? TransactionType.Expense,
          categoryId: transaction?.categoryId ?? 0
        });
      }
      this.wasVisible = visible;
    });

    effect(() => {
      const options = this.categoryOptions();
      const currentCategoryId = this.form.controls.categoryId.value;

      // Clear the selected category when the chosen type no longer matches its options.
      if (currentCategoryId !== 0 && !options.some((option) => option.value === currentCategoryId)) {
        this.form.controls.categoryId.setValue(0);
      }
    });
  }

  get isEditMode(): boolean {
    return this.transaction() !== null;
  }

  onVisibleChange(value: boolean): void {
    this.visibleChange.emit(value);
  }

  onCancel(): void {
    this.visibleChange.emit(false);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      ...value,
      date: toUtcMidnight(value.date),
      description: value.description || undefined
    });
  }
}

// p-datepicker gives a Date at local midnight; Date.toJSON() (used by HttpClient) converts it to a
// UTC string. The backend just echoes the same numbers back without a timezone suffix, so encoding
// the picked day into the UTC component setters keeps the day-of-month stable end-to-end.
function toUtcMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

// The API echoes dates back without a timezone suffix (e.g. "2026-09-15T00:00:00"), which both the
// JS Date constructor and Angular parse as literal local wall-clock values (no conversion). Strip
// the time-of-day using local getters - using UTC getters here would wrongly shift the day.
function fromApiDate(date: Date | string): Date {
  const parsed = new Date(date);
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}
