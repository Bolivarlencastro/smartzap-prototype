import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class DateErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return control?.invalid || control.parent?.get('date').hasError('overlappingDates');
  }
}
