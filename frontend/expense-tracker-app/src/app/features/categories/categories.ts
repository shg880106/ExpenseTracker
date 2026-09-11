import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import {
  Category,
  CategoryRequest,
  getCategoryTypeLabel,
  getCategoryTypeSeverity
} from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { NotificationService } from '../../core/services/notification.service';
import { CategoryForm } from './category-form/category-form';

@Component({
  selector: 'app-categories',
  imports: [ButtonModule, TableModule, TagModule, CategoryForm],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly dialogVisible = signal(false);
  readonly selectedCategory = signal<Category | null>(null);

  readonly getCategoryTypeLabel = getCategoryTypeLabel;
  readonly getCategoryTypeSeverity = getCategoryTypeSeverity;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationService.error('Something went wrong. Please try again.');
      }
    });
  }

  openCreateDialog(): void {
    this.selectedCategory.set(null);
    this.dialogVisible.set(true);
  }

  openEditDialog(category: Category): void {
    this.selectedCategory.set(category);
    this.dialogVisible.set(true);
  }

  confirmDelete(category: Category): void {
    this.confirmationService.confirm({
      header: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { severity: 'danger', label: 'Delete' },
      rejectButtonProps: { severity: 'secondary', text: true, label: 'Cancel' },
      accept: () => this.deleteCategory(category)
    });
  }

  onSave(request: CategoryRequest): void {
    const category = this.selectedCategory();
    this.saving.set(true);

    if (category) {
      this.categoryService.update(category.id, request).subscribe({
        next: () => this.handleSaveSuccess('Category updated successfully.'),
        error: (error: HttpErrorResponse) => this.handleSaveError(error)
      });
    } else {
      this.categoryService.create(request).subscribe({
        next: () => this.handleSaveSuccess('Category created successfully.'),
        error: (error: HttpErrorResponse) => this.handleSaveError(error)
      });
    }
  }

  private handleSaveSuccess(message: string): void {
    this.saving.set(false);
    this.dialogVisible.set(false);
    this.notificationService.success(message);
    this.loadCategories();
  }

  private handleSaveError(error: HttpErrorResponse): void {
    this.saving.set(false);
    this.notificationService.error(this.mapError(error));
  }

  private deleteCategory(category: Category): void {
    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.categories.update((list) => list.filter((c) => c.id !== category.id));
        this.notificationService.success('Category deleted successfully.');
      },
      error: () => {
        this.notificationService.error('Something went wrong. Please try again.');
      }
    });
  }

  private mapError(error: HttpErrorResponse): string {
    if (error.status === 400) {
      return 'Please check the category details and try again.';
    }
    return 'Something went wrong. Please try again.';
  }
}
