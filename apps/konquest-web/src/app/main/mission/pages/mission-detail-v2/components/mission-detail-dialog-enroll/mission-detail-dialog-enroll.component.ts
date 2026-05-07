import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

export interface MissionEnrollDialogData {
  isExternalMission: boolean;
}

@Component({
  selector: 'mission-detail-dialog-enroll',
  templateUrl: './mission-detail-dialog-enroll.component.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatIcon,
    MatFormField,
    MatInput,
    FormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
})
export class MissionDetailDialogEnrollComponent {
  protected targetDate = new Date();
  protected readonly minDate = new Date();
  readonly isExternalMission: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MissionEnrollDialogData,
    public dialogRef: MatDialogRef<MissionDetailDialogEnrollComponent>,
  ) {
    this.isExternalMission = data.isExternalMission;
  }

  saveGoal(): void {
    this.dialogRef.close(this.targetDate);
  }
}
