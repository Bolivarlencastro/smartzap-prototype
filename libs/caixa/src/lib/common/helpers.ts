import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maskCpf(cpf: string): string {
  if (!cpf) {
    return cpf;
  }

  const digits = cpf.replaceAll(/\D/g, '');

  if (digits.length !== 11) {
    return cpf;
  }

  return `***.***.***-${digits.slice(-2)}`;
}

export function equalityValidator(fistControlName: string, secondControlName: string): ValidatorFn {
  const mismatchError = { fieldsMismatch: true };
  return (control: AbstractControl): ValidationErrors | null => {
    const firstControl = control.get(fistControlName);
    const secondControl = control.get(secondControlName);
    const isValid = firstControl.value === secondControl.value;
    if (!isValid) {
      if (secondControl.dirty) {
        secondControl.setErrors(mismatchError);
      }
      return mismatchError;
    } else {
      secondControl.setErrors(null);
      return null;
    }
  };
}
