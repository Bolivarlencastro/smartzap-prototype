import { ChangeDetectionStrategy, Component, effect, Inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@jsverse/transloco';
import { CustomSectionModel } from '../../models/custom-sections';
import { SectionForm } from '../../models/section-form';

@Component({
  selector: 'app-section-form-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslocoModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  template: `
    <form [formGroup]="form" class="p-6 flex flex-col gap-3">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>{{ 'CUSTOM_SECTIONS.SECTION_FORM.TITLE' | transloco }}</mat-label>
        <input data-test="input-section-name" matInput formControlName="title" maxlength="25" />
        <mat-hint align="end">{{ titleLength }}/25</mat-hint>
      </mat-form-field>

      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>{{ 'CUSTOM_SECTIONS.SECTION_FORM.DESCRIPTION' | transloco }}</mat-label>
        <input data-test="input-section-description" matInput formControlName="description" maxlength="30" />
        <mat-hint align="end">{{ descriptionLength }}/30</mat-hint>
      </mat-form-field>

      <div class="border border-default rounded-lg flex flex-col">
        <div class="flex items-center gap-3 border-b border-default p-4">
          <mat-icon class="s-6">schedule</mat-icon>
          <span class="text-sm">{{ 'HOME.BANNER.SETTINGS.SCHEDULE.TITLE' | transloco }}</span>
          <mat-slide-toggle
            class="ml-auto"
            [checked]="hasSchedule()"
            (change)="setScheduleStatus($event)"
          ></mat-slide-toggle>
        </div>
        <div class="p-4 flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <mat-form-field appearance="outline" subscriptSizing="dynamic" floatLabel="always" class="grow">
              <mat-label>{{ 'HOME.BANNER.SETTINGS.SCHEDULE.ACTIVATION' | transloco }}</mat-label>
              <input
                data-test="input-section-start-date"
                matInput
                formControlName="start_date"
                [matDatepicker]="pickerStart"
                placeholder="00/00/0000"
              />
              <mat-datepicker-toggle matSuffix [for]="pickerStart"></mat-datepicker-toggle>
              <mat-datepicker #pickerStart></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" subscriptSizing="dynamic" floatLabel="always" class="grow">
              <mat-label>{{ 'HOME.BANNER.SETTINGS.SCHEDULE.DEACTIVATION' | transloco }}</mat-label>
              <input
                data-test="input-section-end-date"
                matInput
                formControlName="end_date"
                [matDatepicker]="pickerEnd"
                placeholder="00/00/0000"
              />
              <mat-datepicker-toggle matSuffix [for]="pickerEnd"></mat-datepicker-toggle>
              <mat-datepicker #pickerEnd></mat-datepicker>
            </mat-form-field>
          </div>

          @if (form.hasError('invalidDateRange')) {
            <div class="text-xs text-red-500">
              {{ 'HOME.BANNER.SETTINGS.SCHEDULE.ERROR_MESSAGE' | transloco }}
            </div>
          }
        </div>
      </div>
    </form>
    <div mat-dialog-actions class="p-6 flex justify-end rounded-b-3xl">
      <button mat-button mat-dialog-close>
        {{ 'GENERAL.CLOSE' | transloco }}
      </button>

      <button
        data-test="button-save-section"
        mat-flat-button
        color="primary"
        [disabled]="isSaveDisabled"
        (click)="onSave()"
      >
        {{ 'GENERAL.SAVE' | transloco }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFormDialogComponent implements OnInit {
  form: FormGroup<SectionForm>;

  hasSchedule = signal<boolean>(false);

  get isSaveDisabled(): boolean {
    return this.form.invalid || this.form.pristine;
  }

  get titleLength(): number {
    return this.form?.get('title')?.value?.length ?? 0;
  }

  get descriptionLength(): number {
    return this.form?.get('description')?.value?.length ?? 0;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: CustomSectionModel,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<SectionFormDialogComponent>,
  ) {
    this.form = this.buildForm(formBuilder);
    this.configureScheduleToggle();
  }

  ngOnInit() {
    if (this.data) {
      this.patchForm();
    }
  }

  onSave() {
    const data = this.form.value;

    if (!data.start_date || !data.end_date) {
      this.dialogRef.close({ ...this.data, ...data, start_date: null, end_date: null });
      return;
    }

    data.end_date.setHours(23, 59, 59, 0);

    this.dialogRef.close({ ...this.data, ...data, start_date: data.start_date, end_date: data.end_date });
  }

  setScheduleStatus(event: MatSlideToggleChange) {
    const value = event.checked;
    this.form.markAsDirty();
    this.hasSchedule.set(value);
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<SectionForm> {
    return formBuilder.group<SectionForm>(
      {
        title: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        start_date: new FormControl({ value: null, disabled: true }, Validators.required),
        end_date: new FormControl({ value: null, disabled: true }, Validators.required),
      },
      { validators: this.dateRangeValidator() },
    );
  }

  private dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const startDate = group.get('start_date')?.value;
      const endDate = group.get('end_date')?.value;

      if (!startDate || !endDate) {
        return null;
      }

      return endDate < startDate ? { invalidDateRange: true } : null;
    };
  }

  private patchForm() {
    const { title, description, start_date, end_date } = this.data;
    const startDate = start_date ? new Date(start_date) : null;
    const endDate = end_date ? new Date(end_date) : null;

    if (start_date || end_date) {
      this.hasSchedule.set(true);
    }

    this.form.patchValue({ title, description, start_date: startDate, end_date: endDate });
  }

  private configureScheduleToggle() {
    effect(() => {
      if (this.hasSchedule()) {
        this.form.get('start_date').enable();
        this.form.get('end_date').enable();
        return;
      }

      this.form.get('start_date').disable();
      this.form.get('end_date').disable();
      this.form.get('start_date').setValue(null);
      this.form.get('end_date').setValue(null);
    });
  }
}
