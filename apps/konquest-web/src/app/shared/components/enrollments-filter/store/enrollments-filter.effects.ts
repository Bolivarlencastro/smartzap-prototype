import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, of, switchMap } from 'rxjs';
import { EnrollmentsFilterActions } from '.';
import * as LearningTrailEnrollmentsActions from '../../../../main/learning-trail-enrollments/store/learning-trail-enrollments.actions';
import * as MissionEnrollmentsActions from '../../../../main/mission-enrollments/store/mission-enrollments.actions';
import { EnrollmentsFilterService } from '../services/enrollments-filter.service';

@Injectable()
export class EnrollmentsFilterEffects {
  $openFilters = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnrollmentsFilterActions.openFilterDialog),
      switchMap(({ enrollmentType }) =>
        this.enrollmentsFilterService.openFiltersDialog(enrollmentType).pipe(
          filter((result) => !!result),
          map((result) => EnrollmentsFilterActions.storeFilterControllerState({ enrollmentType, filterState: result })),
        ),
      ),
    );
  });

  filterOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnrollmentsFilterActions.filterSelectOptions),
      mergeMap(({ search }) =>
        this.enrollmentsFilterService.getSelectOptions(search).pipe(
          map((results) =>
            EnrollmentsFilterActions.filterSelectOptionsSuccess({
              searchType: search.searchType,
              results,
            }),
          ),
          catchError(() => of(EnrollmentsFilterActions.filterSelectOptionsFailure())),
        ),
      ),
    );
  });

  $storeFilterControllerState = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnrollmentsFilterActions.storeFilterControllerState),
      map(({ enrollmentType, filterState }) => {
        const updatedFilter = EnrollmentsFilterService.parseFilter(filterState.filter);

        return enrollmentType === 'LEARNING_TRAIL'
          ? LearningTrailEnrollmentsActions.saveFilter({ filter: updatedFilter })
          : MissionEnrollmentsActions.saveFilter({ filter: updatedFilter });
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private enrollmentsFilterService: EnrollmentsFilterService,
  ) {}
}
