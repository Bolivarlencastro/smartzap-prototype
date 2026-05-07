import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Mission } from '../mission/mission.model';
import { EvaluationDialogComponent } from './components/evaluation-dialog/evaluation-dialog.component';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  constructor(private _dialog: MatDialog) {}

  private _dialogRef: MatDialogRef<EvaluationDialogComponent>;

  openEvaluationDialog(mission: Mission): MatDialogRef<EvaluationDialogComponent> {
    this._dialogRef = this._dialog.open(EvaluationDialogComponent, {
      ...(window.innerWidth > 768 && { width: '55%' }),
      maxWidth: '80vw',
      maxHeight: '95vh',
      data: mission,
    });

    return this._dialogRef;
  }

  closeDialog(): void {
    this._dialogRef?.close();
  }
}
