import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MissionInformationDate, MissionLive, MissionModel, MissionPresential } from 'app/main/mission/mission.model';
import {
  PresentialLiveDateForm,
  PresentialLiveForm,
  PresentialLiveFormBuilder,
} from 'app/main/mission/pages/mission-create/components/forms/live-presential-form/helpers/presential-live-form-builder';
import { format, isDate } from 'date-fns';
import { DateErrorStateMatcher } from './helpers/date-error-state-matcher';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { NgClass } from '@angular/common';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

@Component({
  selector: 'app-live-presential-form',
  templateUrl: './live-presential-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatHint,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    NgxMaskDirective,
    NgClass,
    MatIconButton,
    MatIcon,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
  ],
})
export class LivePresentialFormComponent implements OnChanges {
  @Input() missionModel: MissionModel = MissionModel.PRESENTIAL;
  @Input() missionModelInfo: MissionLive | MissionPresential;
  @Input() developmentStatus: DevelopmentStatus;

  readonly MissionModel: typeof MissionModel = MissionModel;
  readonly showOnErrorStateMatcher = new DateErrorStateMatcher();
  readonly callLinkRegex = constants.defaultLinkRegex;

  protected readonly livePresentialFormGroup: FormGroup<PresentialLiveForm>;
  private readonly presentialliveFormBuilder: PresentialLiveFormBuilder;

  constructor(
    _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
  ) {
    this.presentialliveFormBuilder = new PresentialLiveFormBuilder(_formBuilder);
    this.livePresentialFormGroup = this.presentialliveFormBuilder.buildInitialForm();
  }

  get invalid(): boolean {
    return this.livePresentialFormGroup?.invalid;
  }

  get isDirty() {
    return this.livePresentialFormGroup?.dirty;
  }

  get showAddressInput(): boolean {
    return this.missionModel !== MissionModel.LIVE;
  }

  get dates(): FormArray<FormGroup<PresentialLiveDateForm>> {
    return this.livePresentialFormGroup.get('dates') as FormArray<FormGroup<PresentialLiveDateForm>>;
  }

  get errorMessages(): string[] {
    const invalidEndDate = this.dates?.controls.some((control) => control.hasError('invalidEndDate'));
    const overlappingDates = this.dates.hasError('overlappingDates');
    const errorMessages: string[] = [];

    if (invalidEndDate) {
      errorMessages.push(marker('MISSION.CREATE.LIVE_PRESENTIAL.ERROR.INVALID_END_TIME'));
    }

    if (overlappingDates) {
      errorMessages.push(marker('MISSION.CREATE.LIVE_PRESENTIAL.ERROR.OVERLAPPING_DATES'));
    }

    return errorMessages;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['missionModel'] || changes['missionModelInfo'] || changes['developmentStatus']) {
      this.updateForm(this.missionModelInfo, this.missionModel, this.livePresentialFormGroup);
    }
  }

  addNewDate(): void {
    const newDateFormGroup = this.presentialliveFormBuilder.buildDateFormGroup(undefined, true);
    this.dates.push(newDateFormGroup, { emitEvent: false });
  }

  removeDate(index: number): void {
    const dateFormGroup = this.dates.controls[index];
    dateFormGroup.get('touched').setValue(true);

    if (dateFormGroup.get('id')?.value) {
      this.markDateFormGroupAsDeleted(dateFormGroup);
      return;
    }

    this.dates.removeAt(index);
  }

  markDateAsTouched(controlIndex: number): void {
    this.dates.at(controlIndex).get('touched').setValue(true);
  }

  datesTrackBy(index: number, _: FormGroup<PresentialLiveDateForm>) {
    return index;
  }

  getFormValue(): Partial<MissionLive> | Partial<MissionPresential> {
    const formValue = this.livePresentialFormGroup.getRawValue();
    const updatedDates = this.formatEventDates(formValue.dates);

    return { ...formValue, dates: updatedDates };
  }

  private formatEventDates(eventDates: MissionInformationDate[]): MissionInformationDate[] {
    return eventDates.map((eventDate) => {
      const parsedDate = isDate(eventDate.date) ? (eventDate.date as Date) : new Date(`${eventDate.date}T00:00:00`);
      const day = format(parsedDate, 'yyyy-MM-dd');
      const startDate = this.updateEventHour(day, eventDate.start_at);
      const endDate = this.updateEventHour(day, eventDate.end_at);

      return { ...eventDate, date: day, start_at: startDate, end_at: endDate };
    });
  }

  private updateEventHour(eventDay: string, eventHour: string): string {
    return format(new Date(`${eventDay}T${eventHour}`), "yyyy-MM-dd'T'HH:mm:ss");
  }

  private updateForm(
    missionInfo: MissionLive | MissionPresential,
    missionModel: MissionModel,
    form: FormGroup<PresentialLiveForm>,
  ): void {
    const missionModelInfo = missionInfo || undefined;

    let mainControlName: 'address' | 'url' = 'address';
    const mainControlValidators: ValidatorFn[] = [Validators.required];

    if (missionModelInfo) {
      const seats = missionModelInfo?.seats;
      const minimumSeats = missionModelInfo?.users_enrolled ?? 0;

      form.get('seats').setValue(seats, { emitEvent: false });
      form.get('seats').setValidators([Validators.min(minimumSeats)]);
    }

    if (missionModel === MissionModel.LIVE) {
      mainControlName = 'url';
      mainControlValidators.push(Validators.pattern(this.callLinkRegex));

      if (form.contains('address')) {
        form.removeControl('address', { emitEvent: false });
      }
    }

    form.setControl(
      mainControlName,
      new FormControl(this.getMissionAddressOrUrl(missionModelInfo), mainControlValidators),
      { emitEvent: false },
    );

    if (missionModelInfo) {
      const patchedDates = this.patchDates(missionModelInfo?.dates);
      const datesFormArray = this.presentialliveFormBuilder.buildDatesArrayFromInitialValue(patchedDates);

      form.setControl('dates', datesFormArray, {
        emitEvent: false,
      });
    }

    form.markAsPristine();
    form.updateValueAndValidity();

    // Ensuring that Change Detection runs after the form has already been filled out
    setTimeout(() => this._cdr.detectChanges(), 0);
  }

  private getMissionAddressOrUrl(missionModelInfo: MissionLive | MissionPresential): string {
    if (!missionModelInfo) {
      return '';
    }

    if ('address' in missionModelInfo) {
      return missionModelInfo['address'];
    }

    return missionModelInfo.url;
  }

  private patchDates(dates: MissionInformationDate[]): MissionInformationDate[] {
    if (!dates?.length) {
      return [];
    }

    return dates?.map((eventDate) => ({ ...eventDate, date: eventDate.start_at }));
  }

  private markDateFormGroupAsDeleted(dateFormGroup: FormGroup<PresentialLiveDateForm>): void {
    dateFormGroup.get('deleted').setValue(true);
    dateFormGroup.get('start_at')?.setErrors(null);
    dateFormGroup.get('end_at')?.setErrors(null);
    dateFormGroup.setErrors(null);
  }
}
