import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { QuestionBankOutput } from '../../models/quiz';
import { QuestionBankComponent } from '../../containers/question-bank/question-bank.component';

@Injectable({ providedIn: 'root' })
export class QuestionBankService {
  private readonly _dialog = inject(MatDialog);

  open(): Observable<QuestionBankOutput[] | undefined> {
    return this._dialog
      .open<QuestionBankComponent, void, QuestionBankOutput[]>(QuestionBankComponent, {
        width: '600px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
      })
      .afterClosed();
  }
}
