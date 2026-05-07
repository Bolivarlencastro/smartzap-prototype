import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CycleEnrollmentsFilterService } from '../../services';
import { CycleEnrollmentsActions, CycleEnrollmentsFilterActions } from '../actions';
import { catchError, filter, map, of, switchMap } from 'rxjs';

@Injectable()
export class CycleEnrollmentsFilterEffects {
  $openFilters = createEffect(() =>
    this.actions$.pipe(
      ofType(CycleEnrollmentsFilterActions.openFilterDialog),
      switchMap(() =>
        this.cycleEnrollmentsFilterService.openFiltersDialog().pipe(
          filter((result) => !!result),
          map((result) => CycleEnrollmentsFilterActions.storeFilterControllerState({ filterState: result })),
        ),
      ),
    ),
  );

  $filter = createEffect(() => {
    return this.actions$.pipe(
      ofType(CycleEnrollmentsFilterActions.storeFilterControllerState),
      map(({ filterState }) => {
        const updatedFilter = this.cycleEnrollmentsFilterService.normalizeFilter(filterState);
        return CycleEnrollmentsActions.filterEnrollments({ filter: updatedFilter });
      }),
    );
  });

  $autocompleteFilter = createEffect(() =>
    this.actions$.pipe(
      ofType(CycleEnrollmentsFilterActions.autocompleteSearch),
      switchMap(({ searchType, search }) =>
        this.cycleEnrollmentsFilterService.filterAutocomplete(searchType, search).pipe(
          map((results) =>
            CycleEnrollmentsFilterActions.autocompleteSearchSuccess({
              results,
              searchType,
            }),
          ),
          catchError(() => of(CycleEnrollmentsFilterActions.autocompleteSearchFailure())),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private cycleEnrollmentsFilterService: CycleEnrollmentsFilterService,
  ) {}
}
