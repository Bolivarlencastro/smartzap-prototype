import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { ImportListService } from '../../services/import-list.service';
import { ImportListActions } from '../actions';
import { importListFeature } from '../features';

@Injectable()
export class ImportListEffects {
  checkImportFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImportListActions.checkImportFile, ImportListActions.selectFileOnInit),
      concatLatestFrom(() => this.store.select(importListFeature.selectEventId)),
      switchMap(([{ file }, eventId]) =>
        this.importListService.checkImportFile(eventId, file).pipe(
          map((importData) => {
            if (this.importListService.verifyImportData(importData)) {
              return ImportListActions.checkImportFileSuccess({ importData });
            }
            return ImportListActions.checkImportFileFailure();
          }),
          catchError(() => of(ImportListActions.checkImportFileFailure())),
        ),
      ),
    );
  });

  confirmImport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImportListActions.confirmImport),
      concatLatestFrom(() => [
        this.store.select(importListFeature.selectViewModel),
        this.store.select(importListFeature.selectSelectedDateId),
      ]),
      switchMap(([_, vm, dateId]) =>
        this.importListService
          .confirmImport(dateId, vm.importDataSource)
          .pipe(map(() => ImportListActions.confirmImportSuccess())),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly importListService: ImportListService,
  ) {}
}
