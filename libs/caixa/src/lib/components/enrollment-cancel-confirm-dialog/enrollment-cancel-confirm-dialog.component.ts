import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'cx-enrollment-cancel-confirm-dialog',
  imports: [MatDialogActions, MatDialogContent, MatDialogTitle, MatDialogClose, MatButton],
  template: `
    <h1 mat-dialog-title class="text-xl">Cancelar matrícula</h1>
    <div mat-dialog-content class="text-sm flex flex-col gap-2">
      <p class="font-bold">Tem certeza de que deseja cancelar sua matrícula?</p>
      <p>Não se preocupe, você poderá se matricular novamente a qualquer momento.</p>
    </div>
    <div mat-dialog-actions class="p-6 pt-5 flex justify-end">
      <button mat-button [mat-dialog-close]="false" class="color-primary">Cancelar</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="true">Confirmar</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentCancelConfirmDialogComponent {}
