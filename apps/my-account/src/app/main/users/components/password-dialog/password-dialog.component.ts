import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, TranslocoPipe],
})
export class PasswordDialogComponent {
  constructor(
    private clipboard: Clipboard,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PasswordDialogComponent>,
  ) {}

  copyPassword() {
    this.clipboard.copy(this.data.password);
    this.dialogRef.close();
  }
}
