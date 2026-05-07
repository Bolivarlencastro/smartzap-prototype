import { Injectable } from '@angular/core';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { CoursesService } from '../../services';
import * as CoursesActions from '../actions/courses.actions';
import { CoursesSelectors } from '../selectors';

@Injectable()
export class CoursesEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.initializeCourses),
      map(() => CoursesActions.setFilter({ filters: { categories: [], languages: [], statuses: [], createdByMe: false } })),
    );
  });

  loadCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.loadCourses),
      tap(() => this._fuseLoadingService.show()),
      concatLatestFrom(() => [
        this.store.select(CoursesSelectors.selectSearchTerm),
        this.store.select(CoursesSelectors.selectFilters),
        this.store.select(CoursesSelectors.selectSort),
      ]),
      switchMap(([{ page }, term, filters, sort]) => {
        const ordering = sort?.direction ? KeepsUtils.buildSort(sort) : undefined;
        return this._coursesService.fetchCourses(page, filters, term, ordering).pipe(
          map((payload) => CoursesActions.loadCoursesSuccess({ payload })),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => of(CoursesActions.loadCoursesFailure({ error }))),
        );
      }),
    );
  });

  searchCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.searchCourses),
      concatLatestFrom(() => this.store.select(CoursesSelectors.selectPage)),
      map(([_, page]) => CoursesActions.loadCourses({ page: { ...page, page: 1 } })),
    );
  });

  setPagination$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.setPagination),
      concatLatestFrom(() => [this.store.select(CoursesSelectors.selectPage)]),
      map(([{ currentPage, per_page }, page]) => {
        return CoursesActions.loadCourses({ page: { ...page, page: currentPage, per_page } });
      }),
    );
  });

  setFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.setFilter, CoursesActions.setSort),
      map(() => CoursesActions.setPage({ page: 1 })),
    );
  });

  setPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoursesActions.setPage),
      concatLatestFrom(() => this.store.select(CoursesSelectors.selectPage)),
      map(([{ page }, actualPage]) => {
        return CoursesActions.loadCourses({ page: { ...actualPage, page } });
      }),
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly _coursesService: CoursesService,
    private readonly _fuseLoadingService: FuseLoadingService,
  ) {}
}
