import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { CsvImportService } from '../../services/csv-import/csv-import.service';
import { CsvImportActions } from './csv-import.actions';

@Injectable()
export class CsvImportEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _csvImportService = inject(CsvImportService);

  parseFile$ = createEffect(() =>
    this._actions$.pipe(
      ofType(CsvImportActions.parseFile),
      switchMap(({ file }) =>
        this._csvImportService.parseFile(file).pipe(
          map((questions) => CsvImportActions.parseFileSuccess({ questions, fileName: file.name })),
          catchError((err: Error) => of(CsvImportActions.parseFileFailure({ error: err.message }))),
        ),
      ),
    ),
  );
}
