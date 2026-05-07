import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { ComplianceDialogActions } from '../actions';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { ComplianceDialogService } from '../../services';
import { complianceDialogFeature } from '../features';

@Injectable()
export class ComplianceDialogEffects {
  openDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceDialogActions.openDialog),
      switchMap(() => this._complianceDialogService.openDialog().pipe(map(() => ComplianceDialogActions.reset()))),
    ),
  );

  loadCompliances$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ComplianceDialogActions.openDialog,
        ComplianceDialogActions.filterCompliance,
        ComplianceDialogActions.batchDeleteSuccess,
      ),
      concatLatestFrom(() => [
        this.store.select(complianceDialogFeature.selectFilter),
        this.store.select(complianceDialogFeature.selectCurrentPage),
      ]),
      switchMap(([_, filter, currentPage]) =>
        this._complianceDialogService.loadCompliance({ search: filter, page: currentPage, perPage: 10 }).pipe(
          map(({ items, total, hasNextPage }) =>
            ComplianceDialogActions.loadComplianceSuccess({
              results: items,
              totalItems: total,
              isFinished: !hasNextPage,
            }),
          ),
          catchError(() => of(ComplianceDialogActions.loadComplianceFailure())),
        ),
      ),
    ),
  );

  loadMoreItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ComplianceDialogActions.loadMoreItems),
      concatLatestFrom(() => [
        this.store.select(complianceDialogFeature.selectFilter),
        this.store.select(complianceDialogFeature.selectCurrentPage),
        this.store.select(complianceDialogFeature.selectIsFinished),
      ]),
      filter(([_, _storeFilter, _currentPage, isFinished]) => !isFinished),
      map(([_, storeFilter, currentPage]) => ({ storeFilter, currentPage })),
      switchMap(({ storeFilter, currentPage }) => {
        return this._complianceDialogService
          .loadCompliance({
            search: storeFilter,
            page: currentPage,
            perPage: 10,
          })
          .pipe(
            map(({ items, total, hasNextPage }) =>
              ComplianceDialogActions.loadMoreItemsSuccess({
                results: items,
                totalItems: total,
                isFinished: !hasNextPage,
              }),
            ),
            catchError(() => of(ComplianceDialogActions.loadComplianceFailure())),
          );
      }),
    );
  });

  saveCompliance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceDialogActions.saveCompliance),
      map(({ compliance }) => {
        if (compliance.id) {
          return ComplianceDialogActions.editCompliance({ compliance });
        }
        return ComplianceDialogActions.addCompliance({ name: compliance.name });
      }),
    ),
  );

  addCompliance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceDialogActions.addCompliance),
      switchMap(({ name }) =>
        this._complianceDialogService.addCompliance(name).pipe(
          map((response) =>
            ComplianceDialogActions.addComplianceSuccess({ compliance: { ...response, selected: false } }),
          ),
          catchError(() => of(ComplianceDialogActions.addComplianceFailure())),
        ),
      ),
    ),
  );

  editCompliance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceDialogActions.editCompliance),
      switchMap(({ compliance }) =>
        this._complianceDialogService.updateCompliance(compliance.id, compliance.name).pipe(
          map(() => {
            const { id, name } = compliance;
            return ComplianceDialogActions.editComplianceSuccess({ payload: { id, changes: { name } } });
          }),
          catchError(() => of(ComplianceDialogActions.editComplianceFailure())),
        ),
      ),
    ),
  );

  deleteCompliance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceDialogActions.deleteCompliance),
      switchMap(({ id }) =>
        this._complianceDialogService.openDeleteConfirmationDialog().pipe(
          filter((value) => value),
          switchMap(() =>
            this._complianceDialogService.deleteCompliance(id).pipe(
              map(() => ComplianceDialogActions.deleteComplianceSuccess({ id })),
              catchError(() => of(ComplianceDialogActions.deleteComplianceFailure())),
            ),
          ),
        ),
      ),
    ),
  );

  batchDeleteCompliances$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceDialogActions.batchDeleteCompliance),
      concatLatestFrom(() => this.store.select(complianceDialogFeature.selectSelectIdsArray)),
      switchMap(([_, ids]) =>
        this._complianceDialogService.openDeleteConfirmationDialog(true).pipe(
          filter((value) => value),
          switchMap(() =>
            this._complianceDialogService.batchDeleteCompliance(ids).pipe(
              map(() => ComplianceDialogActions.batchDeleteSuccess()),
              catchError(() => of(ComplianceDialogActions.batchDeleteSuccess())),
            ),
          ),
        ),
      ),
    ),
  );

  toggleSelectAllCompliance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceDialogActions.toggleSelectAllCompliance),
      concatLatestFrom(() => this.store.select(complianceDialogFeature.selectAll)),
      map(([{ selected }, listItems]) =>
        ComplianceDialogActions.updateAllItemsSelection({
          selected,
          payload: ComplianceDialogService.getBatchSelectUpdate(listItems, selected),
        }),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private _complianceDialogService: ComplianceDialogService,
  ) {}
}
