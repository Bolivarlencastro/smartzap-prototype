import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { QuizDialogComponent } from '../../containers/quiz-dialog/quiz-dialog.component';

@Injectable({ providedIn: 'root' })
export class QuizDialogService {
  private readonly _dialog = inject(MatDialog);
  private _dialogRef: MatDialogRef<QuizDialogComponent> | null = null;

  open(): Observable<void> {
    this._dialogRef = this._dialog.open<QuizDialogComponent>(QuizDialogComponent, {
      maxWidth: '95vw',
      disableClose: false,
    });
    return this._dialogRef.afterClosed();
  }

  close(): void {
    this._dialogRef?.close();
    this._dialogRef = null;
  }
}
