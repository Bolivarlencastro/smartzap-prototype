import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { ExtendDeadlineDialogData } from '@core/model/enrollment.model';
import { format } from 'date-fns';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MatFormField, MatLabel, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

export interface ExtendDeadlineDialogForm {
  goalDate: FormControl<Date>;
}

@Component({
  selector: 'app-extend-deadline-dialog',
  templateUrl: './extend-deadline-dialog.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    MatHint,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatButton,
    MatDialogClose,
    DatePipe,
    TranslocoPipe,
  ],
})
export class ExtendDeadlineDialogComponent {
  minDate = new Date();
  protected readonly form: FormGroup<ExtendDeadlineDialogForm> = new FormGroup<ExtendDeadlineDialogForm>({
    goalDate: new FormControl(null, Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ExtendDeadlineDialogData,
    private _dialogRef: MatDialogRef<ExtendDeadlineDialogComponent>,
  ) {}

  protected onSubmit(): void {
    const goalDate = this.form.get('goalDate').value;
    const dialogResult = format(goalDate, 'yyyy-MM-dd');

    this._dialogRef.close(dialogResult);
  }

  get label() {
    return this.data.learnContentType === 'mission'
      ? marker('EXTEND_DEADLINE_DIALOG.MISSION_DESCRIPTION')
      : marker('EXTEND_DEADLINE_DIALOG.TRAIL_DESCRIPTION');
  }

  get subTitle() {
    return this.data.learnContentType === 'mission'
      ? marker('EXTEND_DEADLINE_DIALOG.MISSION_SUBTITLE')
      : marker('EXTEND_DEADLINE_DIALOG.TRAIL_SUBTITLE');
  }
}
