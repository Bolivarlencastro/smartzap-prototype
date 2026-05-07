import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  QuizWizardDialogComponent,
  QuizWizardDialogResult,
} from '../../components/quiz-wizard-dialog/quiz-wizard-dialog.component';

@Injectable({ providedIn: 'root' })
export class QuizWizardDialogService {
  private readonly _dialog = inject(MatDialog);

  open(): Observable<QuizWizardDialogResult | undefined> {
    return this._dialog
      .open<QuizWizardDialogComponent, void, QuizWizardDialogResult>(QuizWizardDialogComponent, {
        width: '600px',
        disableClose: false,
      })
      .afterClosed();
  }
}
