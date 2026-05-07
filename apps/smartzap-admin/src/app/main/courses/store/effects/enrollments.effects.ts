import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { EnrollmentsService } from 'app/shared/services/enrollments.service';
import { UIActions } from 'app/shared/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { CoursesService } from '../../services';
import { EnrollmentsService as CourseEnrollmentsService } from '../../modules/enrollments/services';
import { CourseActions, EnrollmentsActions } from '../actions';
import { CourseSelectors, EnrollmentsSelectors } from '../selectors';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class EnrollmentsEffects {
  loadEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.loadEnrollments),
      concatLatestFrom(() => [
        this.store.select(CourseSelectors.selectCourse),
        this.store.select(EnrollmentsSelectors.selectGetPage),
        this.store.select(EnrollmentsSelectors.selectGetSort),
        this.store.select(EnrollmentsSelectors.selectGetFilter),
      ]),
      switchMap(([_, { id }, { page, per_page }, sortParams, filter]) => {
        const sort = this._enrollmentsService.buildSort(sortParams);
        return this._enrollmentsService
          .fetchEnrollments({ pagination: { page, per_page }, sort, filter: { ...filter, course_id: id } })
          .pipe(
            map((payload) => EnrollmentsActions.loadEnrollmentsSuccess({ payload })),
            catchError((error) => of(EnrollmentsActions.loadEnrollmentsFailure({ error }))),
          );
      }),
    );
  });

  refreshEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.refreshEnrollments),
      map(() => EnrollmentsActions.loadEnrollments()),
    );
  });

  sortEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.sortEnrollments),
      map(() => EnrollmentsActions.loadEnrollments()),
    );
  });

  setPage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.setPage),
      map(() => EnrollmentsActions.loadEnrollments()),
    );
  });

  setFilter$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.setFilter),
      map(() => EnrollmentsActions.loadEnrollments()),
    );
  });

  fetchMoreEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.fetchMoreEnrollments),
      concatLatestFrom(() => this.store.select(EnrollmentsSelectors.selectGetPage)),
      map(([_, page]) => page),
      filter((page) => page.page < page.total_pages),
      map((currentPagination) =>
        EnrollmentsActions.setPage({
          page: {
            ...currentPagination,
            page: currentPagination.page + 1,
          },
        }),
      ),
    );
  });

  createEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.createEnrolment),
      switchMap(({ course_id, data }) => {
        return this._coursesService.createUserEnrollment(course_id, data).pipe(
          map(() => EnrollmentsActions.createEnrolmentSuccess({ course_id })),
          catchError((error) => {
            const defaultErrorMessage = error.i18n;
            const statusCode = error.status;
            const errorMessageByStatusCodeMap: Record<number, string> = {
              409: 'API.ERROR.ENROLLMENT_IN_PROGRESS',
            };
            const errorMessage = errorMessageByStatusCodeMap[statusCode] || defaultErrorMessage;
            return of(EnrollmentsActions.createEnrolmentFailure({ error: errorMessage }));
          }),
        );
      }),
    );
  });

  importEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.importEnrolments),
      switchMap(({ course_id, data }) => {
        return this._coursesService.importEnrollments(course_id, data).pipe(
          map((response) => EnrollmentsActions.importEnrolmentsSuccess({ data: response, course_id })),
          catchError(() =>
            of(
              EnrollmentsActions.importEnrolmentsFailure({
                error: 'ENROLLMENTS.MESSAGE.IMPORT_ERROR',
              }),
            ),
          ),
        );
      }),
    );
  });

  refreshEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.createEnrolmentSuccess, EnrollmentsActions.importEnrolmentsSuccess),
      map(({ course_id }) =>
        EnrollmentsActions.refreshEnrollments({
          course_id,
        }),
      ),
    );
  });

  importEnrolmentsSuccess$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(EnrollmentsActions.importEnrolmentsSuccess),
        tap(({ data }) => this._courseEnrollmentsService.showImportEnrollmentsErrorDialog(data)),
      );
    },
    { dispatch: false },
  );

  removeEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.removeEnrollment),
      switchMap(({ id }) => {
        return this._coursesService.removeEnrollment(id).pipe(
          map(() => EnrollmentsActions.removeEnrollmentSuccess({ id })),
          catchError(() =>
            of(
              EnrollmentsActions.removeEnrollmentFailure({
                error: 'ENROLLMENTS.MESSAGE.REMOVE_ERROR',
              }),
            ),
          ),
        );
      }),
    );
  });

  cancelEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.cancelEnrollment),
      switchMap(({ enrollmentId }) =>
        this._enrollmentsService.cancel(enrollmentId).pipe(
          map((enrollment) => EnrollmentsActions.cancelEnrollmentSuccess({ enrollment })),
          catchError((error) => of(EnrollmentsActions.cancelEnrollmentFailure({ error }))),
        ),
      ),
    );
  });

  reenroll$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.reenroll),
      switchMap(({ courseId, userId }) => {
        return this._enrollmentsService.create({ userId, courseId }).pipe(
          map((enrollment) => EnrollmentsActions.reenrollSuccess({ enrollment })),
          catchError((error) => of(EnrollmentsActions.reenrollFailure({ error }))),
        );
      }),
    );
  });

  reenrollFailure$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(EnrollmentsActions.reenrollFailure),
        filter(({ error }) => error.status === 409),
        tap(() => {
          const dialogRef = this._dialog.open(KpConfirmDialogComponent);
          dialogRef.componentInstance.hideCancelButton = true;
          dialogRef.componentInstance.confirmTitle = 'SETTINGS.ENROLLMENTS.REENROLL_ERROR_TITLE';
          dialogRef.componentInstance.confirmMessage = 'SETTINGS.ENROLLMENTS.REENROLL_ERROR_MESSAGE';
        }),
      );
    },
    { dispatch: false },
  );

  showProcessing$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        EnrollmentsActions.createEnrolment,
        EnrollmentsActions.importEnrolments,
        EnrollmentsActions.removeEnrollment,
        EnrollmentsActions.cancelEnrollment,
        EnrollmentsActions.reenroll,
      ),
      map(() => UIActions.showProcessing()),
    );
  });

  hideProcessing$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        EnrollmentsActions.createEnrolmentSuccess,
        EnrollmentsActions.importEnrolmentsSuccess,
        EnrollmentsActions.removeEnrollmentFailure,
        EnrollmentsActions.removeEnrollmentSuccess,
        EnrollmentsActions.cancelEnrollmentFailure,
        EnrollmentsActions.cancelEnrollmentSuccess,
        EnrollmentsActions.reenrollSuccess,
        EnrollmentsActions.reenrollFailure,
      ),
      map(() => UIActions.hideProcessing()),
    );
  });

  showFailureMessage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.createEnrolmentFailure, EnrollmentsActions.importEnrolmentsFailure),
      tap(({ error }) => {
        this._messageService.error(error);
      }),
      map(() => UIActions.hideProcessing()),
    );
  });

  clearEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.clearSelectedCourse),
      map(() => EnrollmentsActions.clear()),
    );
  });

  constructor(
    private _coursesService: CoursesService,
    private store: Store,
    private readonly _messageService: KpMessageService,
    private _actions$: Actions,
    private _courseEnrollmentsService: CourseEnrollmentsService,
    private _enrollmentsService: EnrollmentsService,
    private _dialog: MatDialog,
  ) {}
}
