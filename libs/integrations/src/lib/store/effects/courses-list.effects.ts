import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CoursesListService } from '../../services';
import { CoursesListActions } from '../actions';
import { coursesListFeature } from '../features';

@Injectable()
export class CoursesListEffects {
  constructor(
    private _actions$: Actions,
    private coursesListService: CoursesListService,
    private store: Store,
  ) {}

  loadCategories$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CoursesListActions.init),
      switchMap(() =>
        this.coursesListService
          .fetchAluraCategories()
          .pipe(map((categories) => CoursesListActions.loadCategoriesSuccess({ categories }))),
      ),
    );
  });

  loadCoursesList$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CoursesListActions.loadCoursesList),
      concatLatestFrom(() => this.store.select(coursesListFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.coursesListService
          .fetchMirroredCourses(filter)
          .pipe(map((response) => CoursesListActions.loadCoursesListSuccess({ response }))),
      ),
    );
  });

  deleteCourse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CoursesListActions.deleteCourse),
      switchMap(({ courseIds }) =>
        this.coursesListService.batchDeleteCourses(courseIds).pipe(
          map(() => CoursesListActions.deleteCourseSuccess({ courseIds })),
          catchError(() => of(CoursesListActions.deleteCourseFailure())),
        ),
      ),
    );
  });

  toggleActiveCourse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CoursesListActions.toggleActiveCourse),
      switchMap(({ data }) =>
        this.coursesListService.batchUpdateActiveStatus(data).pipe(
          map((result) => CoursesListActions.toggleActiveCourseSuccess({ data: result })),
          catchError(() => of(CoursesListActions.toggleActiveCourseFailure())),
        ),
      ),
    );
  });

  reload$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        CoursesListActions.init,
        CoursesListActions.setPagination,
        CoursesListActions.sort,
        CoursesListActions.filter,
        CoursesListActions.search,
      ),
      map(() => CoursesListActions.loadCoursesList()),
    );
  });

  openDetailDialog$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(CoursesListActions.openDetailDialog),
        tap(({ courseId }) => this.coursesListService.openDetailDialog(courseId)),
      );
    },
    { dispatch: false },
  );
}
