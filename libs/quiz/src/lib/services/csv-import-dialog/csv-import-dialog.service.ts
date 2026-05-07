import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CsvImportDialogComponent } from '../../containers/csv-import-dialog/csv-import-dialog.component';
import { QuestionInput } from '../../models/quiz';

@Injectable({ providedIn: 'root' })
export class CsvImportDialogService {
  private readonly _dialog = inject(MatDialog);

  open(): Observable<QuestionInput[] | undefined> {
    return this._dialog
      .open<CsvImportDialogComponent, void, QuestionInput[]>(CsvImportDialogComponent, {
        width: '800px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
      })
      .afterClosed();
  }
}
