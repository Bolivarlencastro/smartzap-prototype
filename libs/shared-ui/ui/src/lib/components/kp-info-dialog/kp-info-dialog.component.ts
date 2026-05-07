import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';

export interface InfoDialogData {
  title: string;
  description: string;
  buttonLabel?: string;
}

@Component({
  selector: 'kp-info-dialog',
  imports: [TranslocoPipe, MatButton, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './kp-info-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpInfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: InfoDialogData) {}
}
