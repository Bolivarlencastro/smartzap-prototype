import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TransfersFiltersActions } from '../actions';
import { TransfersFiltersService } from '../../services/transfers-filters.service';

@Injectable()
export class TransfersFiltersEffects {
  filterOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersFiltersActions.filterSelectOptions),
      switchMap(({ search, searchType }) =>
        this.transfersFilterService.filterWorkspaces(search).pipe(
          map((results) =>
            TransfersFiltersActions.filterSelectOptionsSuccess({
              searchType,
              results,
            }),
          ),
          catchError(() => of(TransfersFiltersActions.filterSelectOptionsFailure())),
        ),
      ),
    );
  });

  openDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersFiltersActions.openFilterDialog),
      switchMap(() =>
        this.transfersFilterService.openDialog().pipe(
          filter((result) => !!result),
          map((result) =>
            TransfersFiltersActions.storeFilterControllerState({
              filterState: result,
            }),
          ),
        ),
      ),
    );
  });

  initialAutocompleteSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransfersFiltersActions.openFilterDialog),
      switchMap(() =>
        this.transfersFilterService.filterWorkspaces('').pipe(
          map((results) =>
            TransfersFiltersActions.initialFilterSelectOptionsSuccess({
              results,
            }),
          ),
          catchError(() => of(TransfersFiltersActions.filterSelectOptionsFailure())),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private transfersFilterService: TransfersFiltersService,
  ) {}
}
