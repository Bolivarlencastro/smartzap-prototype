import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { CoursesLeaderApi } from '../../../services/courses-leader.api';
import { CourseListActions } from '../actions';
import { courseListFeature } from '../features';

@Injectable()
export class CourseListEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(CourseListActions.init),
      concatLatestFrom(() => this.store.select(courseListFeature.selectLoaded)),
      filter(([_, loaded]) => !loaded),
      map(() => CourseListActions.fetchCourses()),
    );
  });

  fetchCourses$ = createEffect(() => {
    return this.actions.pipe(
      ofType(CourseListActions.fetchCourses),
      concatLatestFrom(() => this.store.select(courseListFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.coursesApi.getCourses(filter).pipe(
          map((response) => CourseListActions.fetchCoursesSuccess({ response })),
          catchError(() => of(CourseListActions.fetchCoursesFailure())),
        ),
      ),
    );
  });

  reloadCourses$ = createEffect(() => {
    return this.actions.pipe(
      ofType(CourseListActions.search, CourseListActions.sort, CourseListActions.setPagination),
      map(() => CourseListActions.fetchCourses()),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly coursesApi: CoursesLeaderApi,
    private readonly store: Store,
  ) {}
}
