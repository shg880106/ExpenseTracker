import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { CATEGORY_TYPE_OPTIONS, Category, CategoryRequest, TransactionType } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss'
})
export class CategoryForm {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly visible = input(false);
  readonly category = input<Category | null>(null);
  readonly saving = input(false);

  readonly visibleChange = output<boolean>();
  readonly save = output<CategoryRequest>();

  readonly typeOptions = CATEGORY_TYPE_OPTIONS;

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    type: [TransactionType.Expense, [Validators.required]]
  });

  private wasVisible = false;

  constructor() {
    effect(() => {
      const category = this.category();
      const visible = this.visible();

      // Only reset when the dialog transitions from closed to open, not on every effect re-run.
      if (visible && !this.wasVisible) {
        this.form.reset({
          name: category?.name ?? '',
          type: category?.type ?? TransactionType.Expense
        });
      }
      this.wasVisible = visible;
    });
  }

  get isEditMode(): boolean {
    return this.category() !== null;
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

    this.save.emit(this.form.getRawValue());
  }
}
