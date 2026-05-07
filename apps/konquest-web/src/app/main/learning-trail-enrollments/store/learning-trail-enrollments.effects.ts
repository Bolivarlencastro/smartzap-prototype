import { Injectable } from '@angular/core';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { LearningTrailEnrollmentsAPI } from '@core/api/learning-trail-enrollments.api';
import { Enrollment, ExtendDeadlineDialogData } from '@core/model/enrollment.model';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { concat, of } from 'rxjs';
import { catchError, concatMap, filter, finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { LearningTrailDoneActionType } from '../consts';

import { LearningTrailEnrollmentsService } from '../learning-trail-enrollments.service';
import * as TrailEnrollmentsActions from './learning-trail-enrollments.actions';
import * as fromSelectors from './learning-trail-enrollments.selectors';
import { EnrollmentsFilterService } from '@app/shared/components/enrollments-filter/services/enrollments-filter.service';
import { EnrollmentsFilterActions } from '@app/shared/components/enrollments-filter';
import { cyclesFeature, globalSettingsFeature } from '@app/shared/store';

@Injectable({ providedIn: 'root' })
export class LearningTrailEnrollmentsEffects {
  constructor(
    private _actions$: Actions,
    private _fuseLoadingService: FuseLoadingService,
    private _enrollmentsAPI: LearningTrailEnrollmentsAPI,
    private store: Store,
    private _enrollmentsService: LearningTrailEnrollmentsService,
    private _messageService: KpMessageService,
    private _enrollmentsFilterService: EnrollmentsFilterService,
  ) {}

  loadEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        ...[
          TrailEnrollmentsActions.loadEnrollments,
          TrailEnrollmentsActions.deleteEnrollmentSuccess,
          TrailEnrollmentsActions.reEnrollEnrollmentSuccess,
          TrailEnrollmentsActions.approveEnrollmentSuccess,
          TrailEnrollmentsActions.restartEnrollmentSuccess,
          TrailEnrollmentsActions.extendDeadlineSuccess,
          TrailEnrollmentsActions.giveUpSuccess,
        ],
      ),
      concatLatestFrom(() => [
        this.store.select(fromSelectors.selectFilter),
        this.store.select(fromSelectors.selectFilterByAllUsers),
        this.store.select(fromSelectors.selectSort),
        this.store.select(cyclesFeature.selectIsNormativeActive),
        this.store.select(globalSettingsFeature.selectBlockReEnrollment),
        this.store.select(fromSelectors.selectIsContentCreator),
      ]),
      map(([_, filter, filteringAllUsers, sortParams, isNormativeActive, blockReEnrollment, isContentCreator]) => {
        return {
          filter: this._enrollmentsService.buildFilter(
            filter,
            filteringAllUsers,
            isContentCreator,
            sortParams ?? undefined,
          ),
          isNormativeActive,
          blockReEnrollment,
        };
      }),
      switchMap(({ filter, isNormativeActive, blockReEnrollment }) => {
        return this._enrollmentsAPI.getLearningTrailEnrollments(filter).pipe(
          map(({ count, results, next }) => {
            const enrollments = this._enrollmentsService.loadEnrollmentsSuccess(
              results as Enrollment[],
              !filter.user,
              isNormativeActive,
              blockReEnrollment,
            );
            return { enrollments, count, next };
          }),
          map(({ enrollments, count, next }) =>
            TrailEnrollmentsActions.loadEnrollmentsSuccess({ enrollments, count, next }),
          ),
          catchError((error) => of(TrailEnrollmentsActions.loadEnrollmentsFailure(error))),
        );
      }),
    );
  });

  loadOnFilter$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        TrailEnrollmentsActions.saveFilter,
        TrailEnrollmentsActions.paginationChange,
        TrailEnrollmentsActions.searchChange,
        TrailEnrollmentsActions.sortChange,
      ),
      map(() => TrailEnrollmentsActions.loadEnrollments()),
    );
  });

  loadEnrollmentsByUser$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.loadEnrollmentsByUser),
      mergeMap(({ userId }) => {
        return this._enrollmentsAPI
          .getLearningTrailEnrollments({
            user: userId,
          })
          .pipe(
            map(({ results }) =>
              TrailEnrollmentsActions.loadEnrollmentsByUserSuccess({ payload: results as Enrollment[] }),
            ),
            catchError((error) => of(TrailEnrollmentsActions.loadEnrollmentsByUserFailure(error))),
          );
      }),
    );
  });

  generateCertificate = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.generateCertificate),
      switchMap(({ enrollmentId, isMobile }) => this._enrollmentsService.generateCertificate(enrollmentId, isMobile)),
    );
  });

  loadTracking$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.loadTracking),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ enrollment }) => this._enrollmentsAPI.getLearningTrailEnrollmentById(enrollment.id)),
      switchMap((enrollment: Enrollment) => this._enrollmentsService.fetchTracking(enrollment)),
    );
  });

  deleteEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.deleteEnrollment),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ id }) => {
        return this._enrollmentsAPI.deleteEnrollment(id).pipe(
          tap(() => this._messageService.success(marker('ENROLLMENTS.DELETE_SUCCESS'))),
          map(() => TrailEnrollmentsActions.deleteEnrollmentSuccess()),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => {
            this._messageService.error(error?.error?.detail);
            return of(TrailEnrollmentsActions.deleteEnrollmentFailure({ error }));
          }),
        );
      }),
    );
  });

  reEnrollEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.reEnrollEnrollment),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ id, goalDate, userId }) => {
        return this._enrollmentsAPI.enroll(id, userId, goalDate).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.RE_ENROLL_SUCCESS'));
            return TrailEnrollmentsActions.reEnrollEnrollmentSuccess();
          }),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => of(TrailEnrollmentsActions.reEnrollEnrollmentFailure({ error }))),
        );
      }),
    );
  });

  restartEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.restartEnrollment),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ id, goalDate }) => {
        return this._enrollmentsAPI.restartEnrollment(id, goalDate).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.RESTART_SUCCESS'));
            return TrailEnrollmentsActions.restartEnrollmentSuccess();
          }),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => {
            this._messageService.error(marker(`ENROLLMENTS.ERROR.${error.error.i18n}`));
            return of(TrailEnrollmentsActions.restartEnrollmentFailure({ error }));
          }),
        );
      }),
    );
  });

  approveEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.approveEnrollment),
      switchMap(({ id, performance }) => this._enrollmentsService.approveEnrollment(id, performance)),
      map(() => {
        this._messageService.success(marker('ENROLLMENTS.APPROVE_SUCCESS'));
        return TrailEnrollmentsActions.approveEnrollmentSuccess();
      }),
      catchError((error) => {
        this._messageService.error(marker(`ENROLLMENTS.ERROR.${error.error.i18n}`));
        return of(TrailEnrollmentsActions.approveEnrollmentFailure({ error }));
      }),
    );
  });

  viewLearningTrail$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(TrailEnrollmentsActions.viewLearningTrail),
        tap(({ enrollment }) => this._enrollmentsService.viewLearningTrail(enrollment)),
      );
    },
    { dispatch: false },
  );

  executeAction = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.executeAction),
      map(({ action, payload }) => {
        const runAction: { [s: string]: any } = {
          [LearningTrailDoneActionType.DELETE]: ({ id }: Enrollment) =>
            TrailEnrollmentsActions.deleteEnrollment({ id }),
          [LearningTrailDoneActionType.VIEW_TRAIL]: (enrollment: Enrollment) =>
            TrailEnrollmentsActions.viewLearningTrail({ enrollment }),
          [LearningTrailDoneActionType.APPROVE_ENROLLMENT]: ({ id, performance, status }: Enrollment) =>
            TrailEnrollmentsActions.approveEnrollment({ id, performance, status }),
          [LearningTrailDoneActionType.RE_ENROLL]: ({
            id,
            goalDate,
            userId,
          }: {
            id: string;
            goalDate: string;
            userId: string;
          }) => TrailEnrollmentsActions.reEnrollEnrollment({ id, goalDate, userId }),
          [LearningTrailDoneActionType.RESTART]: ({ id, goalDate }: { id: string; goalDate: string }) =>
            TrailEnrollmentsActions.restartEnrollment({ id, goalDate }),
        };

        if (runAction[action]) {
          return runAction[action](payload);
        }
      }),
    );
  });

  fetchMoreItems$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.fetchMoreItems),
      concatLatestFrom(() => [
        this.store.select(fromSelectors.selectFilter),
        this.store.select(fromSelectors.selectFilterByAllUsers),
        this.store.select(fromSelectors.selectSort),
        this.store.select(fromSelectors.selectIsFinished),
        this.store.select(cyclesFeature.selectIsNormativeActive),
        this.store.select(globalSettingsFeature.selectBlockReEnrollment),
        this.store.select(fromSelectors.selectIsContentCreator),
      ]),
      filter(
        ([
          _,
          _filter,
          _filteringAllUsers,
          _sortParams,
          isFinished,
          _isNormativeActive,
          _blockReEnrollment,
          _isContentCreator,
        ]) => !isFinished,
      ),
      map(
        ([
          _,
          filter,
          filteringAllUsers,
          sortParams,
          _isFinished,
          isNormativeActive,
          blockReEnrollment,
          isContentCreator,
        ]) => ({
          filter: this._enrollmentsService.buildFilter(
            filter,
            filteringAllUsers,
            isContentCreator,
            sortParams ?? undefined,
          ),
          isNormativeActive,
          blockReEnrollment,
        }),
      ),
      switchMap(({ filter, isNormativeActive, blockReEnrollment }) => {
        return this._enrollmentsAPI.getLearningTrailEnrollments(filter).pipe(
          map(({ count, results, next }) => {
            const enrollments = this._enrollmentsService.loadEnrollmentsSuccess(
              results as Enrollment[],
              !filter.user,
              isNormativeActive,
              blockReEnrollment,
            );
            return { enrollments, count, next };
          }),
          map(({ enrollments, count, next }) =>
            TrailEnrollmentsActions.fetchMoreItemsSuccess({ enrollments, count: count ?? 0, next }),
          ),
        );
      }),
    );
  });

  fetchStatusOptions$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.fetchStatusOptions),
      map(({ enrollmentType }) => {
        const statuses = this._enrollmentsFilterService.getStatusOptions(enrollmentType);
        return TrailEnrollmentsActions.fetchStatusOptionsSuccess({ statuses });
      }),
    );
  });

  resetEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.resetEnrollments),
      map(() => {
        return EnrollmentsFilterActions.resetState();
      }),
    );
  });

  initializeRouteData$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.initializeRouteData),
      concatMap(({ filteringAllUsers, field, direction, isContentCreator }) => {
        return concat(
          of(TrailEnrollmentsActions.setFilteringAllUsers({ filteringAllUsers, isContentCreator })),
          of(TrailEnrollmentsActions.sortChange({ field, direction })),
          of(TrailEnrollmentsActions.loadEnrollments()),
        );
      }),
    );
  });

  openExtendDeadlineDialog$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.openExtendDeadlineDialog),
      switchMap(({ enrollment }) => {
        const data: ExtendDeadlineDialogData = {
          user: enrollment.user.name,
          startDate: enrollment.start_date,
          currentGoalDate: enrollment.goal_date,
          learningObjectName: enrollment.learning_trail.name,
          learnContentType: 'trail',
        };
        return this._enrollmentsService.openExtendDeadlineDialog(data).pipe(
          filter((goalDate) => !!goalDate),
          map((goalDate) => {
            return TrailEnrollmentsActions.extendDeadline({
              payload: {
                enrollmentId: enrollment.id,
                userId: enrollment.user.id,
                goalDate,
              },
            });
          }),
        );
      }),
    );
  });

  extendDeadline$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.extendDeadline),
      switchMap(({ payload }) => {
        const { enrollmentId, goalDate } = payload;
        return this._enrollmentsService.extendDeadline(enrollmentId, goalDate).pipe(
          map(() => TrailEnrollmentsActions.extendDeadlineSuccess()),
          catchError(() => of(TrailEnrollmentsActions.extendDeadlineFailure())),
        );
      }),
    );
  });

  giveUp$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(TrailEnrollmentsActions.giveUp),
      switchMap(({ enrollmentId }) => {
        return this._enrollmentsService.giveUp(enrollmentId).pipe(map(() => TrailEnrollmentsActions.giveUpSuccess()));
      }),
    );
  });
}
