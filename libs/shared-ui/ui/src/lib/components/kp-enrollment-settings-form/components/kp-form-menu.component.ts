import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { EnrollmentConfig, EnrollmentType, EnrollmentTypeOptions } from '../model';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { startWith, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';

import { MatSelect } from '@angular/material/select';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface EnrollmentConfigForm {
  date: FormControl<string>;
  enrollmentType: FormControl<EnrollmentType>;
  cycle?: FormControl<any>;
}

const ENROLLMENT_OPTIONS: EnrollmentTypeOptions[] = [
  {
    label: marker('UI.KP_ENROLLMENT_SETTINGS_FORM.FREE_ENROLLMENT_TYPE'),
    value: EnrollmentType.FREE,
  },
  {
    label: marker('UI.KP_ENROLLMENT_SETTINGS_FORM.REQUIRED_ENROLLMENT_TYPE'),
    value: EnrollmentType.REQUIRED,
  },
  {
    label: marker('UI.KP_ENROLLMENT_SETTINGS_FORM.COMPLIANCE_ENROLLMENT_TYPE'),
    value: EnrollmentType.COMPLIANCE,
  },
];

@Component({
  selector: 'kp-form-menu',
  templateUrl: './kp-form-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatSelect,
    MatOption,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatIcon,
    MatButton,
    TranslocoPipe,
  ],
})
export class KpFormMenuComponent implements OnChanges, OnDestroy {
  @Input() cycles: CycleDto[] = [];
  @Input() enrollmentConfig: EnrollmentConfig;
  @Input() isNormativeActive;
  @Output() formSubmit = new EventEmitter<EnrollmentConfig>();
  @Output() closeEvent = new EventEmitter<void>();
  @Output() resetEvent = new EventEmitter<void>();
  @Output() filterCycle = new EventEmitter<string>();

  readonly form: FormGroup<EnrollmentConfigForm>;
  protected minDate = new Date();
  private readonly unsub = new Subject<void>();

  constructor(_formBuilder: FormBuilder) {
    this.form = this.buildForm(_formBuilder);
    this.registerCycleAutocomplete();
  }

  get disabledSubmitButton(): boolean {
    const isNormative = this.form?.get('enrollmentType')?.value === EnrollmentType.COMPLIANCE;
    const isCycleInvalid = !this.form?.get('cycle')?.value?.id;

    return this.form.invalid || (isNormative && isCycleInvalid);
  }

  get enrollmentTypeOptions(): EnrollmentTypeOptions[] {
    marker('UI.KP_ENROLLMENT_SETTINGS_FORM.COMPLIANCE_ENROLLMENT_TYPE');
    return this.isNormativeActive
      ? ENROLLMENT_OPTIONS
      : ENROLLMENT_OPTIONS.filter((option) => option.value !== EnrollmentType.COMPLIANCE);
  }

  get isNormative(): boolean {
    return this.form.get('enrollmentType').value === EnrollmentType.COMPLIANCE;
  }

  cycleDisplay(cycle: CycleDto) {
    return cycle?.compliance?.name || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enrollmentConfig']) {
      this.form.patchValue(this.enrollmentConfig);
    }
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  onSubmit(): void {
    this.formSubmit.emit(this.form.getRawValue());
  }

  closeMenu(): void {
    this.restoreFormValue();
    this.closeEvent.emit();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private registerCycleAutocomplete() {
    this.form
      .get('cycle')
      .valueChanges.pipe(
        debounceTime(200),
        startWith(''),
        filter((value) => typeof value === 'string'),
        takeUntil(this.unsub),
      )
      .subscribe((value) => this.filterCycle.emit(value));
  }

  private restoreFormValue(): void {
    if (!this.enrollmentConfig) {
      this.form.reset();
      return;
    }

    this.form.patchValue(this.enrollmentConfig);
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<EnrollmentConfigForm> {
    const form = formBuilder.group<EnrollmentConfigForm>({
      date: new FormControl(null, Validators.required),
      enrollmentType: new FormControl(null, Validators.required),
      cycle: new FormControl(null),
    });

    form
      .get('enrollmentType')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((enrollmentType: EnrollmentType) => {
        const cycleControl = form.get('cycle');

        if (enrollmentType !== EnrollmentType.COMPLIANCE) {
          cycleControl.clearValidators();
          cycleControl.updateValueAndValidity();
          return;
        }

        cycleControl.setValidators(Validators.required);
        cycleControl.updateValueAndValidity();
      });

    return form;
  }
}
