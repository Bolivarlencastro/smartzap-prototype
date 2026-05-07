import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'kp-confirm-dialog',
  templateUrl: './kp-confirm-dialog.component.html',
  styles: [
    `
      .mdc-dialog__title {
        padding-top: 24px !important;
      }
    `,
  ],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatFormField,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
  ],
})
export class KpConfirmDialogComponent {
  public confirmTitle!: string;
  public confirmMessage!: string;
  public showDescription!: boolean;
  public description!: string;
  public hideCancelButton!: boolean;
  public negativeButtonLabel!: string;
  public positiveButtonLabel!: string;
  minLenght: number;

  constructor(public dialogRef: MatDialogRef<KpConfirmDialogComponent>) {}
}
