import { UntypedFormControl } from '@angular/forms';
import { parsePhoneNumber, PhoneNumber } from 'libphonenumber-js';

export const phoneNumberValidator = (control: UntypedFormControl) => {
  const error = { validatePhoneNumber: true };
  let numberInstance: PhoneNumber;
  if (control.value) {
    if (control.value?.length <= 3) {
      return null;
    }
    try {
      numberInstance = parsePhoneNumber(control.value);
    } catch (_e) {
      return error;
    }

    if (numberInstance && !numberInstance.isValid()) {
      if (!control.touched) {
        control.markAsTouched();
      }
      return error;
    }
  }
  return null;
};
