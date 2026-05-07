import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { RemoveDialogActionData } from '../../../shared/group-shared.model';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-group-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss'],
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatCheckbox, MatButton, TranslocoPipe],
})
export class RemoveDialogComponent {
  removeEnrollments = false;

  constructor(public dialogRef: MatDialogRef<RemoveDialogComponent, RemoveDialogActionData>) {}

  toggleRemoveEnrollment() {
    this.removeEnrollments = !this.removeEnrollments;
  }

  onCancel() {
    this.dialogRef.close({ ok: false });
  }

  onConfirm() {
    this.dialogRef.close({
      ok: true,
      removeEnrollments: this.removeEnrollments,
    });
  }
}
