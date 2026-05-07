import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { dateOverlapValidator, eventDateValidator } from './mission-date-validator';

describe('endDateValidator', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('01 Jul 2023 08:00:00 GMT-0300'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return a ValidationError if end_at is less than 10 minutes after start_at', () => {
    const formGroup = new FormGroup({
      date: new FormControl('2023-07-01'),
      start_at: new FormControl('09:00'),
      end_at: new FormControl('09:02'),
    });
    const expectedResult = { invalidEndDate: true };
    const result = eventDateValidator(formGroup);

    expect(result).toEqual(expectedResult);
  });
});

describe('dateOverlapValidator', () => {
  it('should return a ValidationError if one or more dates are overlapping', () => {
    const firstDate = new FormGroup({
      date: new FormControl('2023-01-02'),
      start_at: new FormControl('09:00'),
      end_at: new FormControl('10:00'),
    });
    const secondDate = new FormGroup({
      date: new FormControl('2023-01-02'),
      start_at: new FormControl('09:30'),
      end_at: new FormControl('10:30'),
    });
    const formArray = new FormArray([firstDate, secondDate]);
    const expectedResult = { overlappingDates: true };

    const result = dateOverlapValidator(formArray);

    expect(result).toEqual(expectedResult);
  });
});
