import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { UIActions } from 'app/shared/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { CoursesService } from '../../services';
import { CourseActions, CoursesActions, LessonsActions } from '../actions';
import { Store } from '@ngrx/store';
import { CourseSelectors } from 'app/main/courses/store/selectors';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class CourseEffects {
  publish$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.publish),
      concatMap(({ id }) =>
        this._coursesService.publish(id).pipe(
          tap(() => this._messageService.success('COURSE.MESSAGE.PUBLISH')),
          map((status) => CourseActions.publishSuccess({ status })),
          catchError(() =>
            of(
              CourseActions.publishFailure({
                error: 'COURSE.MESSAGE.PUBLISH_ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  startPublish$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.startPublish),
      concatMap(({ id }) =>
        this._coursesService.startPublishProcess(id).pipe(
          tap(() => this._messageService.success('COURSE.MESSAGE.PUBLISH')),
          tap(() => {
            this._router.navigateByUrl('/courses');
          }),
          map((status) => CourseActions.publishSuccess({ status })),
          catchError(() =>
            of(
              CourseActions.publishFailure({
                error: 'COURSE.MESSAGE.PUBLISH_ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  loadCourse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.loadCourse),
      concatMap((action) =>
        this._coursesService.fetchCourse(action.id).pipe(
          map((course) => {
            const { user_creator } = course;
            const isOwner = user_creator.id === this._authService.userId;
            return CourseActions.loadCourseSuccess({ course, isOwner });
          }),
          catchError((error) => of(CourseActions.loadCourseFailure({ error }))),
        ),
      ),
    );
  });

  setOwnerEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.loadCourseSuccess),
      map(({ isOwner }) => CourseActions.setOwner({ isOwner })),
    );
  });

  loadLessonsEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.loadCourseSuccess),
      map(({ course }) => LessonsActions.loadLessons({ course_id: course.id })),
    );
  });

  createCourse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.createCourse),
      concatMap((action) =>
        this._coursesService.saveCourse(action.course).pipe(
          tap(() => this._messageService.success('COURSE.MESSAGE.CREATED')),
          tap(({ id }) => {
            this._router.navigate(['/courses', id, 'form', 'images']);
          }),
          map((course) => CourseActions.createCourseSuccess({ course })),
          catchError((error) => {
            const errorMessage = error.i18n
              ? `COURSE.FORM.ERROR.BY_FIELD.${error.i18n}`
              : 'COURSE.MESSAGE.ACTION_FALILURE';
            return of(
              CourseActions.createCourseFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    );
  });

  updateCourse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.updateCourse),
      concatMap(({ id, course, nextRoute }) =>
        this._coursesService.updateCourse(id, course).pipe(
          tap(() => this._messageService.success('COURSE.MESSAGE.UPDATED')),
          tap(() => {
            if (nextRoute?.length) {
              this._router.navigate(nextRoute);
            }
          }),
          map((updatedCourse) => CourseActions.updateCourseSuccess({ course: updatedCourse })),
          catchError((error) => {
            const errorMessage = error.i18n
              ? `COURSE.FORM.ERROR.BY_FIELD.${error.i18n}`
              : 'COURSE.MESSAGE.ACTION_FALILURE';
            return of(
              CourseActions.updateCourseFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    );
  });

  deleteCourse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.deleteCourse),
      concatMap(({ id }) =>
        this._coursesService.deleteCourse(id).pipe(
          map(() => CourseActions.deleteCourseSuccess({ course_id: id })),
          catchError(() =>
            of(
              CourseActions.deleteCourseFailure({
                error: 'COURSE.MESSAGE.ACTION_FALILURE',
              }),
            ),
          ),
        ),
      ),
    );
  });

  deleteCourseSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.deleteCourseSuccess),
      map(() => CoursesActions.reset()),
      tap(() => this._messageService.success('COURSE.MESSAGE.DELETED')),
      tap(() => {
        this._router.navigate(['/courses']);
      }),
    );
  });

  duplicateCourse$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.duplicateCourse),
      concatMap(({ id }) =>
        this._coursesService.duplicateCourse(id).pipe(
          map((course) => CourseActions.duplicateCourseSuccess({ course })),
          catchError(() => of(CourseActions.duplicateCourseFailure({ error: 'COURSE.MESSAGE.DUPLICATE_ERROR' }))),
        ),
      ),
    );
  });

  duplicateCourseSuccess$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(CourseActions.duplicateCourseSuccess),
        tap(({ course }) => {
          this._messageService.success('COURSE.MESSAGE.DUPLICATED');
          this._router.navigate(['/courses', course.id, 'form']);
        }),
      );
    },
    { dispatch: false },
  );

  loadCourseFailure$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(CourseActions.loadCourseFailure),
        tap(() => this._messageService.error('COURSE.MESSAGE.NOT_FOUND')),
        tap(() => {
          this._router.navigate(['/courses']);
        }),
      );
    },
    { dispatch: false },
  );

  showProcessing$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.updateCourse, CourseActions.deleteCourse, CourseActions.createCourse),
      map(() => UIActions.showProcessing()),
    );
  });

  hideProcessing$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        CourseActions.updateCourseSuccess,
        CourseActions.deleteCourseSuccess,
        CourseActions.createCourseSuccess,
        CourseActions.loadCourseSuccess,
        CourseActions.loadCourseFailure,
      ),
      map(() => UIActions.hideProcessing()),
    );
  });

  showFailureMessage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.updateCourseFailure, CourseActions.deleteCourseFailure, CourseActions.createCourseFailure),
      tap(({ error }) => {
        this._messageService.error(error);
      }),
      map(() => UIActions.hideProcessing()),
    );
  });

  updateCourseSummary$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.updateCourseDescription),
      concatLatestFrom(() => this.store.select(CourseSelectors.selectCourseId)),
      concatMap(([{ summary }, courseId]) =>
        this._coursesService.updateSummary(courseId, summary).pipe(
          tap(() => this._messageService.success('COURSE.MESSAGE.DESCRIPTION_UPDATED')),
          map(() => CourseActions.updateCourseDescriptionSuccess({ summary })),
          catchError(() => {
            this._messageService.error('COURSE.MESSAGE.DESCRIPTION_UPDATE_ERROR');
            return of(CourseActions.updateCourseDescriptionFailure());
          }),
        ),
      ),
    );
  });

  constructor(
    private _coursesService: CoursesService,
    private readonly _messageService: KpMessageService,
    private _authService: AuthService,
    private _router: Router,
    private _actions$: Actions,
    private store: Store,
  ) {}
}
