import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { TrackingDialogComponent } from 'app/main/courses/modules/enrollments/components/tracking-dialog/tracking-dialog.component';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { EnrollmentsService } from 'app/shared/services/enrollments.service';
import { EnrollmentsActions } from '../actions';
import { EnrollmentsStatistics } from '../reducers/enrollments.reducer';
import * as fromSelectors from '../selectors';
import { Update } from '@ngrx/entity';
import { Enrollment } from '../../../courses/model';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class EnrollmentsEffects {
  constructor(
    private store: Store,
    private _enrollmentsService: EnrollmentsService,
    private _actions$: Actions,
    private _dialog: MatDialog,
    private readonly _messageService: KpMessageService,
  ) {}

  loadEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.loadEnrollments, EnrollmentsActions.loadEnrollmentsAndStatistics),
      concatLatestFrom(() => [
        this.store.select(fromSelectors.selectPagination),
        this.store.select(fromSelectors.selectSort),
        this.store.select(fromSelectors.selectFilter),
      ]),
      switchMap(([, { page, per_page }, sortParams, filter]) => {
        const sort = this._enrollmentsService.buildSort(sortParams);
        return this._enrollmentsService.fetchEnrollments({ pagination: { page, per_page }, sort, filter }).pipe(
          map((payload) => EnrollmentsActions.loadEnrollmentsSuccess({ payload })),
          catchError((error) => of(EnrollmentsActions.loadEnrollmentsFailure({ error }))),
        );
      }),
    );
  });

  setPagination$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.setPagination),
      map(() => EnrollmentsActions.loadEnrollments()),
    );
  });

  setSort$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.setSort),
      map(() => EnrollmentsActions.loadEnrollments()),
    );
  });

  setFilter$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.setFilter),
      switchMap(() => of(EnrollmentsActions.loadEnrollmentsAndStatistics())),
    );
  });

  loadStatistics$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.loadStatistics, EnrollmentsActions.loadEnrollmentsAndStatistics),
      map(() => ({
        periodFilter: {
          startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
        },
      })),
      switchMap(({ periodFilter }) =>
        forkJoin({
          enrollmentsByStatus: this._enrollmentsService.countEnrollmentsByStatus(),
          pendingMessages: this._enrollmentsService.countPendingMessages(),
          sentMessages: this._enrollmentsService.countSentMessages(),
          totalUsers: this._enrollmentsService.countTotalUsers(),
          sentMessagesByPeriod: this._enrollmentsService.countSentMessages(periodFilter),
        }),
      ),
      map(({ enrollmentsByStatus, pendingMessages, sentMessages, totalUsers, sentMessagesByPeriod }) => {
        const statistics: EnrollmentsStatistics = {
          startedEnrollments: enrollmentsByStatus.started,
          totalPendingMessages: pendingMessages,
          totalSentMessages: sentMessages,
          totalSentMessagesPeriod: sentMessagesByPeriod,
          totalUsers,
          waitingEnrollments: enrollmentsByStatus.waiting,
        };
        return EnrollmentsActions.loadStatisticsSuccess({ payload: statistics });
      }),
      catchError((error) => of(EnrollmentsActions.loadStatisticsFailure({ error }))),
    );
  });

  loadEnrollmentsFailure$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(EnrollmentsActions.loadEnrollmentsFailure),
        tap(({ error }) => {
          console.error('[Smartzap enrollments] load failed', error);
          this._messageService.error('GENERAL.ERROR_TRY_AGAIN');
        }),
      );
    },
    { dispatch: false },
  );

  deleteEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.deleteEnrollment),
      switchMap(({ payload }) =>
        this._enrollmentsService.delete(payload.id).pipe(
          map(() => EnrollmentsActions.deleteEnrollmentSuccess({ payload: payload.id })),
          catchError((error) => of(EnrollmentsActions.deleteEnrollmentFailure({ error }))),
        ),
      ),
    );
  });

  cancelEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.cancelEnrollment),
      switchMap(({ payload }) =>
        this._enrollmentsService.cancel(payload.id).pipe(
          map((payload) => {
            const updatedEnrollment: Update<Enrollment> = { id: payload.id || '', changes: payload };
            return EnrollmentsActions.cancelEnrollmentSuccess({ payload: updatedEnrollment });
          }),
          catchError((error) => of(EnrollmentsActions.cancelEnrollmentFailure({ error }))),
        ),
      ),
    );
  });

  reenroll$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.reenroll),
      switchMap(({ payload }) => {
        const { userId, courseId } = payload;
        return this._enrollmentsService.create({ userId, courseId }).pipe(
          map((payload) => EnrollmentsActions.reenrollSuccess({ payload })),
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

  loadEnrollmentActivities$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.openEnrollmentActivities),
      map(({ payload }) => EnrollmentsActions.loadEnrollmentTracking({ payload: payload.id || '' })),
    );
  });

  openEnrollmentActivities$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.openEnrollmentActivities),
      switchMap(({ payload }) => {
        const dialogRef = this._dialog.open(TrackingDialogComponent, { width: '100%', maxWidth: '80vw' });
        dialogRef.componentInstance.enrollment = payload;
        dialogRef.componentInstance.isVisibilitySendLink = payload.status !== 'COMPLETED';
        dialogRef.componentInstance.datasource$ = this.store.select(fromSelectors.selectEnrollmentTracking);
        dialogRef.componentInstance.isLoading$ = this.store.select(fromSelectors.selectIsLoadingEnrollmentTracking);

        return dialogRef.componentInstance.renewAccessSelected.pipe(
          map((renewAccess) => EnrollmentsActions.enrollmentRenewContentAccess({ payload: renewAccess })),
        );
      }),
    );
  });

  enrollmentRenewContentAccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.enrollmentRenewContentAccess),
      switchMap(({ payload }) => {
        return this._enrollmentsService
          .renewContentAccess({
            contentId: payload.content_id,
            enrollmentId: payload.enrollment_id,
          })
          .pipe(
            map(() => EnrollmentsActions.enrollmentRenewContentAccessSuccess()),
            catchError((error) => of(EnrollmentsActions.enrollmentRenewContentAccessFailure({ error }))),
          );
      }),
    );
  });

  enrollmentRenewContentAccessSuccess$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(EnrollmentsActions.enrollmentRenewContentAccessSuccess),
        tap(() => this._messageService.success('TRACKING.LINK_SEND_SUCCESS')),
      );
    },
    { dispatch: false },
  );

  enrollmentRenewContentAccessFailure$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(EnrollmentsActions.enrollmentRenewContentAccessFailure),
        tap(() => this._messageService.error('TRACKING.LINK_SEND_ERROR')),
      );
    },
    { dispatch: false },
  );

  loadEnrollmentTracking$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(EnrollmentsActions.loadEnrollmentTracking),
      switchMap(({ payload }) => {
        return this._enrollmentsService.fetchTracking(payload).pipe(
          map((payload) => EnrollmentsActions.loadEnrollmentTrackingSuccess({ payload })),
          catchError((error) => of(EnrollmentsActions.loadEnrollmentTrackingFailure({ error }))),
        );
      }),
    );
  });
}
