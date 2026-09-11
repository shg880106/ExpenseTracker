import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

// Handles cross-cutting HTTP failures (network issues, expired sessions, server errors).
// Errors that need a form/field-specific message are re-thrown for the component to handle.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        notificationService.error('Unable to reach the server. Please try again later.');
      } else if (error.status === 401 && authService.getToken()) {
        authService.logout();
        notificationService.error('Your session has expired. Please sign in again.');
      } else if (error.status >= 500) {
        notificationService.error('Something went wrong. Please try again.');
      }

      return throwError(() => error);
    })
  );
};
