import { Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-snackbar-template',
  imports: [MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MatIconButton, MatIcon],
  template: `
    <span data-test="notification-element" matSnackBarLabel>{{ data }}</span>
    <span matSnackBarActions>
      <button mat-icon-button matSnackBarAction (click)="dismiss()">
        <mat-icon>close</mat-icon>
      </button>
    </span>
  `,
  styles: `
    :host {
      display: flex;
      border-radius: 4px;
    }
  `,
})
export class KpSnackbarTemplateComponent {
  protected data: string = inject(MAT_SNACK_BAR_DATA);
  protected snackBarRef = inject(MatSnackBarRef);

  dismiss() {
    this.snackBarRef.dismissWithAction();
  }
}
