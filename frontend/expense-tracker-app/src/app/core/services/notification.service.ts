import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

// Thin wrapper around PrimeNG's MessageService so components share a consistent toast style.
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messageService = inject(MessageService);

  success(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }

  error(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }
}
