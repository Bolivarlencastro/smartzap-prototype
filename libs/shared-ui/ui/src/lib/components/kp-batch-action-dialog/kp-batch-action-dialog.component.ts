import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { isBefore, startOfDay } from 'date-fns';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { KpPluralizeTranslatePipe } from '../../pipes';
import {
  ACTION_PARAMS,
  BatchActionDialogConfig,
  BatchActionDialogModel,
  BatchActionDialogStep,
  DIALOG_CONFIG,
  REFERENCE_VALUE_CONFIG,
} from './models';

@Component({
  selector: 'kp-batch-action-dialog',
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    NgxMaskDirective,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    KpPluralizeTranslatePipe,
  ],
  providers: [provideNgxMask()],
  templateUrl: './kp-batch-action-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpBatchActionDialogComponent {
  config: BatchActionDialogConfig;
  language: string;
  total: number;
  step: BatchActionDialogStep = 'initial';
  minDate = new Date();

  initialForm: FormControl;
  submitForm: FormControl;

  constructor(
    private translate: TranslocoService,
    private dialogRef: MatDialogRef<KpBatchActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: BatchActionDialogModel,
  ) {
    this.setInitialConfig();
    this.buildInitialForm();
    this.buildSubmitForm();
  }

  nextStep(): void {
    this.step = 'submit';
  }

  submit(): void {
    const buildParams = ACTION_PARAMS.get(this.data.action) ?? (() => true);
    this.dialogRef.close(buildParams(this.initialForm.value));
  }

  private setInitialConfig(): void {
    this.config = DIALOG_CONFIG[this.data.action];
    this.language = this.translate.getActiveLang();
    this.total = this.data.total;
  }

  private buildInitialForm(): void {
    this.initialForm = new FormControl(null, this.initialFormValidator());
  }

  private initialFormValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const actionsWithDate = ['RESTART_ENROLLMENT', 'RE_ENROLL_ENROLLMENT', 'GOAL_DATE_ENROLLMENT'];
      const actionsWithData = ['APPROVE_ENROLLMENT', 'REJECT_CERTIFICATE', ...actionsWithDate];

      if (actionsWithData.includes(this.config.id) && !control.value) {
        return { required: true };
      }

      if (actionsWithDate.includes(this.config.id)) {
        const selectedDate = startOfDay(new Date(control.value));
        const today = startOfDay(new Date());

        if (isBefore(selectedDate, today)) {
          return { invalidDate: true };
        }
      }
      return null;
    };
  }

  private buildSubmitForm(): void {
    this.submitForm = new FormControl('', this.referenceValueValidator());
  }

  private referenceValueValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputValue = control.value?.toLowerCase();
      const reference = REFERENCE_VALUE_CONFIG[this.config.id][this.language];

      if (inputValue !== reference) {
        return { noMatch: true };
      }
      return null;
    };
  }
}
