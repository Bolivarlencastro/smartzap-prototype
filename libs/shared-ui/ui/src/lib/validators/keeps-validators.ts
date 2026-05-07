import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TIME_ZONES } from './timezones';

export class KeepsValidators {
  /**
   * Validates if the controlValue is present in the [Timezones list]{@link .TIME_ZONES}
   */
  public static requireTimezone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selection: any = control.value;
      const includes = TIME_ZONES.includes(selection);

      if (!includes) {
        return { invalid: true };
      }

      return null;
    };
  }
}
