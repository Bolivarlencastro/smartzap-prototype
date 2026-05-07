import { Component, Inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

export interface KpLogDialogData {
  title: string;
  log: string;
}

@Component({
  selector: 'kp-log-dialog',
  templateUrl: './kp-log-dialog.component.html',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, TranslocoPipe],
})
export class KpLogDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: KpLogDialogData) {}
}
