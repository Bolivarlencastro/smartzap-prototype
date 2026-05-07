import { Injectable } from '@angular/core';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TransferService } from '../../services/transfer.service';
import { TransfersActions, TransfersFiltersActions } from '../actions';
import * as fromSelectors from '../selectors/transfer.selectors';

@Injectable()
export class TransferEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private transfersService: TransferService,
  ) {}

  loadTransfers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersActions.loadTransfers),
      concatLatestFrom(() => [
        this.store.select(fromSelectors.selectPage),
        this.store.select(fromSelectors.selectPerPage),
        this.store.select(fromSelectors.selectSearch),
        this.store.select(fromSelectors.selectSort),
        this.store.select(fromSelectors.selectFilter),
      ]),
      switchMap(([, page, perPage, search, sort, filter]) => {
        const ordering = sort?.direction ? KeepsUtils.buildSort(sort) : undefined;
        return this.transfersService
          .fetch({
            page,
            per_page: perPage,
            ...(search && { search }),
            ...(ordering && { ordering }),
            ...filter,
          })
          .pipe(
            map((response) => TransfersActions.loadTransfersSuccess({ payload: response })),
            catchError((error) => of(TransfersActions.loadTransfersFailure({ error }))),
          );
      }),
    );
  });

  setPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersActions.setPage),
      map(() => TransfersActions.loadTransfers()),
    );
  });

  setPagination$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersActions.paginationChange),
      map(() => TransfersActions.loadTransfers()),
    );
  });

  setSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersActions.setSearch),
      map(() => TransfersActions.setPage({ page: 1 })),
    );
  });

  setSort$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersActions.setSort),
      map(() => TransfersActions.setPage({ page: 1 })),
    );
  });

  setFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersActions.setFilters),
      map(() => TransfersActions.setPage({ page: 1 })),
    );
  });

  saveDialogFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersFiltersActions.storeFilterControllerState),
      map(({ filterState }) =>
        TransfersActions.setFilters({
          filter: TransferService.mapAutocompleteOptions(filterState.filter),
        }),
      ),
    );
  });

  deleteTransfer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersActions.deleteTransfer),
      switchMap(({ id }) =>
        this.transfersService.confirmCancel(id).pipe(
          map(() => TransfersActions.deleteTransferSuccess({ id })),
          catchError((error) => of(TransfersActions.deleteTransferFailure({ error }))),
        ),
      ),
    );
  });
}
