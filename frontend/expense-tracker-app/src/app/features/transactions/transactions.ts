import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { forkJoin } from 'rxjs';

import { Category } from '../../core/models/category.model';
import {
  Transaction,
  TransactionRequest,
  getTransactionTypeLabel,
  getTransactionTypeSeverity
} from '../../core/models/transaction.model';
import { CategoryService } from '../../core/services/category.service';
import { NotificationService } from '../../core/services/notification.service';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionForm } from './transaction-form/transaction-form';

@Component({
  selector: 'app-transactions',
  imports: [ButtonModule, TableModule, TagModule, DatePipe, CurrencyPipe, TransactionForm],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions implements OnInit {
  private readonly transactionService = inject(TransactionService);
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly transactions = signal<Transaction[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly dialogVisible = signal(false);
  readonly selectedTransaction = signal<Transaction | null>(null);

  private categoryNamesById = new Map<number, string>();

  readonly getTransactionTypeLabel = getTransactionTypeLabel;
  readonly getTransactionTypeSeverity = getTransactionTypeSeverity;

  ngOnInit(): void {
    this.loadTransactions();
  }

  getCategoryName(categoryId: number): string {
    return this.categoryNamesById.get(categoryId) ?? 'Unknown';
  }

  openCreateDialog(): void {
    this.selectedTransaction.set(null);
    this.dialogVisible.set(true);
  }

  openEditDialog(transaction: Transaction): void {
    this.selectedTransaction.set(transaction);
    this.dialogVisible.set(true);
  }

  confirmDelete(transaction: Transaction): void {
    this.confirmationService.confirm({
      header: 'Delete Transaction',
      message: 'Are you sure you want to delete this transaction? This action cannot be undone.',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { severity: 'danger', label: 'Delete' },
      rejectButtonProps: { severity: 'secondary', text: true, label: 'Cancel' },
      accept: () => this.deleteTransaction(transaction)
    });
  }

  onSave(request: TransactionRequest): void {
    const transaction = this.selectedTransaction();
    this.saving.set(true);

    if (transaction) {
      this.transactionService.update(transaction.id, request).subscribe({
        next: () => this.handleSaveSuccess('Transaction updated successfully.'),
        error: (error: HttpErrorResponse) => this.handleSaveError(error)
      });
    } else {
      this.transactionService.create(request).subscribe({
        next: () => this.handleSaveSuccess('Transaction created successfully.'),
        error: (error: HttpErrorResponse) => this.handleSaveError(error)
      });
    }
  }

  private handleSaveSuccess(message: string): void {
    this.saving.set(false);
    this.dialogVisible.set(false);
    this.notificationService.success(message);
    this.loadTransactions();
  }

  private handleSaveError(error: HttpErrorResponse): void {
    this.saving.set(false);
    this.notificationService.error(this.mapError(error));
  }

  private deleteTransaction(transaction: Transaction): void {
    this.transactionService.delete(transaction.id).subscribe({
      next: () => {
        this.transactions.update((list) => list.filter((t) => t.id !== transaction.id));
        this.notificationService.success('Transaction deleted successfully.');
      },
      error: () => {
        this.notificationService.error('Something went wrong. Please try again.');
      }
    });
  }

  private mapError(error: HttpErrorResponse): string {
    if (error.status === 400) {
      return 'Please check the transaction details and try again.';
    }
    return 'Something went wrong. Please try again.';
  }

  private loadTransactions(): void {
    this.loading.set(true);

    forkJoin({
      transactions: this.transactionService.getMine(),
      categories: this.categoryService.getAll()
    }).subscribe({
      next: ({ transactions, categories }: { transactions: Transaction[]; categories: Category[] }) => {
        this.categories.set(categories);
        this.categoryNamesById = new Map(categories.map((category) => [category.id, category.name]));
        this.transactions.set(transactions);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Something went wrong. Please try again.');
      }
    });
  }
}
