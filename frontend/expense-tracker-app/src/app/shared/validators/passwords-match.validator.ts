import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Cross-field validator that flags the confirm-password control when it doesn't match password.
export function passwordsMatchValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey);
    const confirmPassword = group.get(confirmPasswordKey);

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value !== password.value) {
      confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
    } else if (confirmPassword.hasError('passwordMismatch')) {
      const { passwordMismatch, ...rest } = confirmPassword.errors ?? {};
      confirmPassword.setErrors(Object.keys(rest).length ? rest : null);
    }

    return null;
  };
}
