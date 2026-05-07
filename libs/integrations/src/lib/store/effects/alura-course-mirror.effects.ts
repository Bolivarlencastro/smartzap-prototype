import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { AluraCourseMirrorService, CoursesListService } from '../../services';
import { AluraCourseMirrorActions, CoursesListActions } from '../actions';
import { aluraCourseMirrorFeature } from '../features';

@Injectable()
export class AluraCourseMirrorEffects {
  constructor(
    private _actions$: Actions,
    private aluraCourseMirrorService: AluraCourseMirrorService,
    private coursesListService: CoursesListService,
    private store: Store,
  ) {}

  openDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(AluraCourseMirrorActions.openDialog),
      switchMap(() => {
        return this.aluraCourseMirrorService.openDialog().pipe(
          map((ids) => {
            if (ids?.length) {
              return AluraCourseMirrorActions.mirrorCourses({ ids });
            }
            return AluraCourseMirrorActions.dialogClosed();
          }),
        );
      }),
    );
  });

  dialogClosed$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(AluraCourseMirrorActions.dialogClosed, AluraCourseMirrorActions.mirrorCourses),
      map(() => AluraCourseMirrorActions.resetState()),
    );
  });

  init$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(AluraCourseMirrorActions.openDialog),
      map(() => AluraCourseMirrorActions.loadCoursesList()),
    );
  });

  loadCoursesList$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(AluraCourseMirrorActions.loadCoursesList),
      concatLatestFrom(() => this.store.select(aluraCourseMirrorFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.aluraCourseMirrorService
          .fetchCoursesList(filter)
          .pipe(map((response) => AluraCourseMirrorActions.loadCoursesListSuccess({ response }))),
      ),
    );
  });

  loadMoreCourses$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(AluraCourseMirrorActions.loadMoreCourses),
      concatLatestFrom(() => [
        this.store.select(aluraCourseMirrorFeature.selectFilter),
        this.store.select(aluraCourseMirrorFeature.selectIsFinished),
      ]),
      filter(([_, _filter, isFinished]) => !isFinished),
      switchMap(([_, filter]) =>
        this.aluraCourseMirrorService.fetchCoursesList(filter).pipe(
          map((response) => AluraCourseMirrorActions.loadMoreCoursesSuccess({ response })),
          catchError(() => of(AluraCourseMirrorActions.loadMoreCoursesFailure())),
        ),
      ),
    );
  });

  reload$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(AluraCourseMirrorActions.filter, AluraCourseMirrorActions.search),
      map(() => AluraCourseMirrorActions.loadCoursesList()),
    );
  });

  loadCategories$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(AluraCourseMirrorActions.openDialog),
      switchMap(() =>
        this.coursesListService
          .fetchAluraCategories()
          .pipe(map((categories) => AluraCourseMirrorActions.setCategories({ categories }))),
      ),
    );
  });

  mirrorCourses$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(AluraCourseMirrorActions.mirrorCourses),
      switchMap(({ ids }) =>
        this.aluraCourseMirrorService.mirrorCourses(ids).pipe(map(() => CoursesListActions.loadCoursesList())),
      ),
    );
  });
}
