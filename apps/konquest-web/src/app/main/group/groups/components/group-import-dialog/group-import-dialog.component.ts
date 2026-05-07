import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { format } from 'date-fns';
import { EnrollmentUploadComponent } from '../../../shared/components/upload/enrollment-upload.component';

import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-import-dialog',
  templateUrl: './group-import-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EnrollmentUploadComponent,
    MatSlideToggle,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
})
export class GroupImportDialogComponent {
  checked: boolean;
  minDate: Date;
  goalDate: UntypedFormControl;
  uploadFormData: any;
  selectedFile!: string;
  title: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<GroupImportDialogComponent>,
  ) {
    this.title = data.title;
    this.checked = false;
    this.goalDate = new UntypedFormControl('', [Validators.required]);
    this.minDate = new Date();
    this.goalDate.disable();
  }

  onSelectFile(event: any): void {
    const { file } = event;
    this.uploadFormData = event;
    this.selectedFile = file.name;
  }

  toggleEnrollment() {
    this.checked = !this.checked;

    if (!this.checked) {
      this.goalDate.reset();
      this.goalDate.disable();
      return;
    }

    this.goalDate.enable();
  }

  onSubmit(): void {
    let goal_date;

    if (this.goalDate.value) {
      goal_date = format(this.goalDate.value, 'yyyy-MM-dd');
    }

    const file = this.uploadFormData;
    this._dialogRef.close({ goal_date, file });
  }
}
