import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { format, isBefore, isDate, isValid, subMinutes } from 'date-fns';

/**
 * Checks if the event start and end times are valid
 */
export const eventDateValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const startControl = formGroup?.get('start_at');
  const endControl = formGroup?.get('end_at');

  if (!startControl || !endControl) {
    return null;
  }

  const eventDay = parseEventDay(formGroup?.get('date').value);
  const startTime = parseEventTime(eventDay, startControl.value);
  const validStartDate = validateStartTime(startTime);
  const validEndDate = validateEndTime(eventDay, startTime, endControl.value);

  if (validStartDate && validEndDate) {
    endControl.setErrors(null);
    startControl.setErrors(null);
    return null;
  }

  const errors: ValidationErrors = {};
  if (!validStartDate) {
    startControl?.setErrors({ invalidStartDate: true });
    errors['invalidStartDate'] = true;
  }

  if (!validEndDate) {
    endControl?.setErrors({ invalidEndDate: true });
    errors['invalidEndDate'] = true;
  }

  return errors;
};

/**
 * Checks if any date overlaps another in the formArray
 * @param formArray
 */
export const dateOverlapValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  const formArray = form as FormArray;
  const dates: [{ date: Date | string; start_at: string; end_at: string }] = formArray?.value;

  if (!dates?.length) {
    return null;
  }

  const formattedDates = dates.map((date) => {
    const day = parseEventDay(date.date);
    const from = new Date(`${day}T${date.start_at}`);
    const to = new Date(`${day}T${date.end_at}`);
    return { from, to };
  });

  const overlapping = multipleDateRangeOverlaps(formattedDates);
  if (overlapping !== null && overlapping >= 0) {
    formArray.at(overlapping)?.get('date')?.setErrors({ overlappingDates: true });
    return { overlappingDates: true };
  }

  formArray.controls.forEach((control) => control.get('date').setErrors(null));
  return null;
};

function dateRangeOverlaps(fromStart: Date, fromEnd: Date, toStart: Date, toEnd: Date): boolean {
  const aStart = fromStart.valueOf();
  const aEnd = fromEnd.valueOf();
  const bStart = toStart.valueOf();
  const bEnd = toEnd.valueOf();

  return (aStart <= bStart && bStart <= aEnd) || (aStart <= bEnd && bEnd <= aEnd) || (bStart < aStart && aEnd < bEnd);
}

function multipleDateRangeOverlaps(times: { from: Date; to: Date }[]): number | null {
  if (!times || times.length <= 1) {
    return null;
  }

  for (let i = 0; i < times.length - 1; i++) {
    for (let j = i + 1; j < times.length; j++) {
      if (dateRangeOverlaps(times[i].from, times[i].to, times[j].from, times[j].to)) {
        return j;
      }
    }
  }
  return null;
}

function validateStartTime(startTime: Date): boolean {
  return isValid(startTime);
}

function validateEndTime(eventDate: string, startDateTime: Date, endControlValue: string): boolean {
  const endHour = subMinutes(parseEventTime(eventDate, endControlValue), 9);
  return isValid(endHour) && isBefore(startDateTime, endHour);
}

function parseEventDay(eventDate: Date | string): string {
  if (isDate(eventDate)) {
    return format(eventDate as Date, 'yyyy-MM-dd');
  }
  return format(new Date(`${eventDate}T00:00:00`), 'yyyy-MM-dd');
}

function parseEventTime(eventDay: string, eventTime: string) {
  return new Date(`${eventDay}T${eventTime}`);
}
