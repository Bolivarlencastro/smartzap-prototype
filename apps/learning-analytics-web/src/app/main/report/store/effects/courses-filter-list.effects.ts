import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SimpleFilterReportService } from '../../services';
import { CoursesFilterListActions } from '../actions';

@Injectable()
export class CoursesFilterListEffects {
  loadItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesFilterListActions.loadFilterItems),
      switchMap(({ filter }) =>
        this.service.fetchOptions('COURSES', filter).pipe(
          map(({ items, loaded }) => CoursesFilterListActions.loadFilterItemsSuccess({ items, loaded })),
          catchError((error) => of(CoursesFilterListActions.loadFilterItemsFailure({ error }))),
        ),
      ),
    );
  });

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesFilterListActions.searchItems),
      switchMap(({ filter }) =>
        this.service.fetchOptions('COURSES', filter).pipe(
          map(({ items, loaded }) => CoursesFilterListActions.searchItemsSuccess({ items, loaded })),
          catchError((error) => of(CoursesFilterListActions.searchItemsFailure({ error }))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private service: SimpleFilterReportService,
  ) {}
}
