import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MissionInformationDate } from 'app/main/mission/mission.model';
import { addDays, addHours, format } from 'date-fns';
import { dateOverlapValidator, eventDateValidator } from './mission-date-validator';

export interface PresentialLiveDateForm {
  start_at: FormControl<string>;
  date: FormControl<string>;
  end_at: FormControl<string>;
  touched: FormControl<boolean>;
  deleted: FormControl<boolean>;
  id: FormControl<string>;
}

export interface PresentialLiveForm {
  seats?: FormControl<number>;
  address?: FormControl<string>;
  url?: FormControl<string>;
  dates: FormArray<FormGroup<PresentialLiveDateForm>>;
}

export class PresentialLiveFormBuilder {
  constructor(private _formBuilder: FormBuilder) {}

  buildDateFormGroup(initialValue?: MissionInformationDate, nextDay?: boolean): FormGroup<PresentialLiveDateForm> {
    const startHour = this.formatEventTime(initialValue?.start_at, 1);
    const endHour = this.formatEventTime(initialValue?.end_at, 2);
    const date = this.formatEventDate(initialValue?.date, nextDay);

    const dateFormGroup = this._formBuilder.group<PresentialLiveDateForm>(
      {
        date: new FormControl(date, [Validators.required]),
        start_at: new FormControl(startHour, [Validators.required]),
        end_at: new FormControl(endHour, [Validators.required]),
        touched: new FormControl(!initialValue),
        deleted: new FormControl(false),
        id: new FormControl(initialValue?.id || null),
      },
      { validators: eventDateValidator },
    );

    return dateFormGroup;
  }

  buildDatesArrayFromInitialValue(
    initialValue: MissionInformationDate[],
  ): FormArray<FormGroup<PresentialLiveDateForm>> {
    const datesFormGroups = this.buildNDateFormGroups(initialValue);

    return this._formBuilder.array(datesFormGroups, {
      validators: dateOverlapValidator,
    });
  }

  buildInitialForm(): FormGroup<PresentialLiveForm> {
    return this._formBuilder.group<PresentialLiveForm>({
      seats: new FormControl(null),
      address: new FormControl('', [Validators.required]),
      dates: new FormArray([this.buildDateFormGroup()], {
        validators: dateOverlapValidator,
      }),
    });
  }

  private buildNDateFormGroups(initialValues: MissionInformationDate[]): FormGroup<PresentialLiveDateForm>[] {
    // As the initial value may be undefined when the mission has just been created, or an empty array, we return an empty date form group
    if (!initialValues?.length) {
      return [this.buildDateFormGroup()];
    }

    return initialValues?.map((initialValue) => {
      return this.buildDateFormGroup(initialValue);
    });
  }

  private formatEventTime(dateTime: string, increaseHours?: number): string {
    if (!dateTime) {
      return format(addHours(new Date(), increaseHours ?? 0), 'HH:00');
    }
    return format(new Date(dateTime), 'HH:mm');
  }

  private formatEventDate(dateTime: string | Date, addOneDay?: boolean): string {
    if (!dateTime) {
      return format(addDays(new Date(), addOneDay ? 1 : 0), 'yyyy-MM-dd');
    }
    return format(new Date(dateTime), 'yyyy-MM-dd');
  }
}
