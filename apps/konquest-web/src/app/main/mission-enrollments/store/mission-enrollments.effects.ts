import { Injectable } from '@angular/core';
import { MissionDoneActionType } from '@app/main/mission-enrollments/consts';
import { EnrollmentsFilterActions } from '@app/shared/components/enrollments-filter';
import { EnrollmentsFilterService } from '@app/shared/components/enrollments-filter/services/enrollments-filter.service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { Enrollment } from '@core/model/enrollment.model';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { EvaluationService } from 'app/main/evaluation/evaluation.service';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { CertificateUploadActions } from 'app/shared/components/certificate-upload';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { concat, of } from 'rxjs';
import { catchError, concatMap, filter, finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import * as MissionEnrollmentsActions from './mission-enrollments.actions';
import * as fromSelectors from './mission-enrollments.selectors';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { cyclesFeature, globalSettingsFeature } from '@app/shared/store';
import { MissionEnrollmentsService } from '../services/mission-enrollments.service';

@Injectable({ providedIn: 'root' })
export class MissionEnrollmentsEffects {
  constructor(
    private _actions$: Actions,
    private _fuseLoadingService: FuseLoadingService,
    private _enrollmentsAPI: MissionEnrollmentsAPI,
    private _messageService: KpMessageService,
    private store: Store,
    private _enrollmentsService: MissionEnrollmentsService,
    private _evaluationService: EvaluationService,
    private _missionService: MissionServiceV2,
    private _enrollmentsFilterService: EnrollmentsFilterService,
  ) {}

  getRouteDataAndLoadEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.getRouteDataAndLoadEnrollments),
      concatMap(({ filteringAllUsers, isCourse, isContentCreator }) => {
        return concat(
          of(MissionEnrollmentsActions.setFilteringAllUsers({ filteringAllUsers, isCourse, isContentCreator })),
          of(MissionEnrollmentsActions.loadEnrollments()),
        );
      }),
    );
  });

  reset$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.resetEnrollments),
      map(() => {
        return EnrollmentsFilterActions.resetState();
      }),
    );
  });

  loadEnrollments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        ...[
          MissionEnrollmentsActions.loadEnrollments,
          MissionEnrollmentsActions.requestExtendDeadlineSuccess,
          MissionEnrollmentsActions.deleteEnrollmentSuccess,
          MissionEnrollmentsActions.giveUpEnrollmentSuccess,
          MissionEnrollmentsActions.restartEnrollmentSuccess,
          MissionEnrollmentsActions.rejectEnrollmentCertificateSuccess,
          MissionEnrollmentsActions.reEnrollEnrollmentSuccess,
          MissionEnrollmentsActions.retakeEnrollmentSuccess,
          CertificateUploadActions.uploadCertificateSuccess,
          MissionEnrollmentsActions.approveEnrollmentSuccess,
          MissionEnrollmentsActions.approveEnrollmentCertificateSuccess,
          MissionEnrollmentsActions.extendGoalDateEnrollmentSuccess,
          MissionEnrollmentsActions.setPresentialLiveApprovalSuccess,
          MissionEnrollmentsActions.finishPresentialLiveSuccess,
        ],
      ),
      concatLatestFrom(() => [
        this.store.select(fromSelectors.selectFilter),
        this.store.select(fromSelectors.selectFilterByAllUsers),
        this.store.select(fromSelectors.selectSort),
        this.store.select(fromSelectors.selectIsCourse),
        this.store.select(cyclesFeature.selectIsNormativeActive),
        this.store.select(globalSettingsFeature.selectBlockReEnrollment),
        this.store.select(fromSelectors.selectIsContentCreator),
      ]),
      switchMap(
        ([
          _,
          filter,
          filteringAllUsers,
          sortParams,
          isCourse,
          isNormativeActive,
          blockReEnrollment,
          isContentCreator,
        ]) => {
          const builtFilter = this._enrollmentsService.buildFilter(
            filter,
            filteringAllUsers || false,
            isCourse,
            isContentCreator,
            sortParams,
          );
          return this._missionService.fetchEnrollmentMissions(builtFilter).pipe(
            map(({ count, results, next }) => {
              const enrollments = this._enrollmentsService.loadEnrollmentsSuccess(
                results,
                !builtFilter.user,
                isNormativeActive,
                blockReEnrollment,
              );
              return { enrollments, count, next };
            }),
            map(({ enrollments, count, next }) =>
              MissionEnrollmentsActions.loadEnrollmentsSuccess({ enrollments, count: count ?? 0, next }),
            ),
            catchError((error) => of(MissionEnrollmentsActions.loadEnrollmentsFailure(error))),
          );
        },
      ),
    );
  });

  loadOnFilter$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        MissionEnrollmentsActions.saveFilter,
        MissionEnrollmentsActions.paginationChange,
        MissionEnrollmentsActions.searchChange,
        MissionEnrollmentsActions.sortChange,
      ),
      map(() => MissionEnrollmentsActions.loadEnrollments()),
    );
  });

  loadLinkedLearningTrails = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.loadLinkedLearningTrails),
      switchMap(({ missionId }) => this._enrollmentsService.getLearningTrailSteps(missionId)),
    );
  });

  loadEnrollmentsByUser$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.loadEnrollmentsByUser),
      mergeMap(({ missionId, userId }) => {
        return this._missionService
          .fetchEnrollmentMissions({
            mission: missionId,
            user: userId,
          })
          .pipe(
            map(({ results }) =>
              MissionEnrollmentsActions.loadEnrollmentsByUserSuccess({ payload: results as Enrollment[] }),
            ),
            catchError((error) => of(MissionEnrollmentsActions.loadEnrollmentsByUserFailure(error))),
          );
      }),
    );
  });

  loadEnrollmentsByUserSuccess$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionEnrollmentsActions.loadEnrollmentsByUserSuccess),
        map(({ payload }) => this._enrollmentsService.openEnrollmentsByUser(payload)),
      );
    },
    { dispatch: false },
  );

  generateCertificate = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.generateCertificate),
      switchMap(({ id, isMobile }) => this._enrollmentsService.generateCertificate(id, isMobile)),
    );
  });

  loadTracking$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.loadTracking),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ enrollment }) => this._enrollmentsAPI.fetchById(enrollment.id)),
      switchMap((enrollment: Enrollment) => this._enrollmentsService.fetchTracking(enrollment)),
    );
  });

  requestExtendDeadline$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.requestExtendDeadline),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ id }) => {
        return this._enrollmentsAPI.requestExtendDeadline(id).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.REQUEST_EXTEND_SUCCESS'));
            return MissionEnrollmentsActions.requestExtendDeadlineSuccess();
          }),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => of(MissionEnrollmentsActions.requestExtendDeadlineFailure({ error }))),
        );
      }),
    );
  });

  deleteEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.deleteEnrollment),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ id }) => {
        return this._enrollmentsAPI.deleteEnrollment(id).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.DELETE_SUCCESS'));
            return MissionEnrollmentsActions.deleteEnrollmentSuccess();
          }),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => {
            this._messageService.error(error?.error?.detail);
            return of(MissionEnrollmentsActions.deleteEnrollmentFailure({ error }));
          }),
        );
      }),
    );
  });

  restartEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.restartEnrollment),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ id, goalDate }) => {
        return this._enrollmentsAPI.restartEnrollment(id, goalDate).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.RESTART_SUCCESS'));
            return MissionEnrollmentsActions.restartEnrollmentSuccess();
          }),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => {
            this._messageService.error(marker(`ENROLLMENTS.ERROR.${error.error.i18n}`));
            return of(MissionEnrollmentsActions.restartEnrollmentFailure({ error }));
          }),
        );
      }),
    );
  });

  loadEnrollmentHistory$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.loadEnrollmentHistory),
      switchMap(({ id }) =>
        this._missionService.loadHistory(id).pipe(
          map((approve_msg: string) => MissionEnrollmentsActions.loadEnrollmentHistorySuccess({ approve_msg })),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => of(MissionEnrollmentsActions.loadEnrollmentHistoryFailure({ error }))),
        ),
      ),
    );
  });

  giveUpEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.giveUpEnrollment),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ id, message }) => {
        return this._enrollmentsAPI.giveUp(id, message).pipe(
          tap(() => this._fuseLoadingService.hide()),
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.GIVE_UP_SUCCESS'));
            return MissionEnrollmentsActions.giveUpEnrollmentSuccess();
          }),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => of(MissionEnrollmentsActions.giveUpEnrollmentFailure({ error }))),
        );
      }),
    );
  });

  rejectCertificateEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.rejectEnrollmentCertificate),
      switchMap(({ id, message }) =>
        this._enrollmentsAPI.externalValidate(id, false, message).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.REJECT_CERTIFICATE_SUCCESS'));
            return MissionEnrollmentsActions.rejectEnrollmentCertificateSuccess();
          }),
          catchError((error) => of(MissionEnrollmentsActions.rejectEnrollmentCertificateFailure({ error }))),
        ),
      ),
    );
  });

  reEnrollEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.reEnrollEnrollment),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ id, goalDate, userId }) => {
        return this._missionService.enroll(id, userId, goalDate).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.RE_ENROLL_SUCCESS'));
            return MissionEnrollmentsActions.reEnrollEnrollmentSuccess();
          }),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => of(MissionEnrollmentsActions.reEnrollEnrollmentFailure({ error }))),
        );
      }),
    );
  });

  retakeEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.retakeEnrollment),
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ id, goalDate }) => {
        return this._missionService.missionRetake(id, goalDate).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.RETAKE_SUCCESS'));
            return MissionEnrollmentsActions.retakeEnrollmentSuccess();
          }),
          finalize(() => this._fuseLoadingService.hide()),
          catchError((error) => of(MissionEnrollmentsActions.retakeEnrollmentFailure({ error }))),
        );
      }),
    );
  });

  approveEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.approveEnrollment),
      switchMap(({ id, status, performance }) => this._enrollmentsService.approveEnrollment(id, status, performance)),
      map(() => {
        this._messageService.success(marker('ENROLLMENTS.APPROVE_SUCCESS'));
        return MissionEnrollmentsActions.approveEnrollmentSuccess();
      }),
      catchError((error) => {
        this._messageService.error(marker(`ENROLLMENTS.ERROR.${error.error.i18n}`));
        return of(MissionEnrollmentsActions.approveEnrollmentFailure({ error }));
      }),
    );
  });

  approveEnrollmentCertificate$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.approveEnrollmentCertificate),
      switchMap(({ id, performance }) =>
        this._enrollmentsAPI.externalValidate(id, true, null, performance.toFixed(2)).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.APPROVE_CERTIFICATE_SUCCESS'));
            return MissionEnrollmentsActions.approveEnrollmentCertificateSuccess();
          }),
          catchError((error) => of(MissionEnrollmentsActions.approveEnrollmentCertificateFailure({ error }))),
        ),
      ),
    );
  });

  setPresentialLiveApproval$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.setPresentialLiveApproval),
      switchMap(({ id, approved }) =>
        this._enrollmentsAPI.setPresentialLiveApproval(id, approved).pipe(
          map(() => {
            const successMessage = approved ? 'ENROLLMENTS.APPROVE_SUCCESS' : 'ENROLLMENTS.REFUSE_SUCCESS';
            this._messageService.success(marker(successMessage));
            return MissionEnrollmentsActions.setPresentialLiveApprovalSuccess();
          }),
          catchError((error) => {
            this._messageService.error(error.error.detail[0]);
            return of(MissionEnrollmentsActions.setPresentialLiveApprovalFailure({ error }));
          }),
        ),
      ),
    );
  });

  finishPresentialLive$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.finishPresentialLive),
      switchMap(({ id }) =>
        this._enrollmentsAPI.finishPresentialLiveEnrollment(id).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.FINISH_PRESENTIAL_SUCCESS'));
            return MissionEnrollmentsActions.finishPresentialLiveSuccess();
          }),
          catchError((error) => {
            this._messageService.error(error.error.detail[0]);
            return of(MissionEnrollmentsActions.finishPresentialLiveFailure({ error }));
          }),
        ),
      ),
    );
  });

  extendGoalDateEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.extendGoalDateEnrollment),
      switchMap(({ id, goalDate }) =>
        this._enrollmentsAPI.extendGoalDate(id, goalDate).pipe(
          map(() => {
            this._messageService.success(marker('ENROLLMENTS.EXTEND_SUCCESS'));
            return MissionEnrollmentsActions.extendGoalDateEnrollmentSuccess();
          }),
          catchError((error) => {
            if (error?.error?.i18n) {
              this._messageService.error(`ENROLLMENTS.ERROR.${error.error.i18n}`);
            } else {
              this._messageService.error(marker('ENROLLMENTS.ERROR.EXTEND_GOAL_DATE_FAILURE'));
            }

            return of(MissionEnrollmentsActions.extendGoalDateEnrollmentFailure({ error }));
          }),
        ),
      ),
    );
  });

  viewMission$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionEnrollmentsActions.viewMission),
        tap(({ enrollment }) => this._enrollmentsService.navigateToMission(enrollment)),
      );
    },
    { dispatch: false },
  );

  openAttachCertificate$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.openAttachCertificate),
      tap(() => this._fuseLoadingService.hide()),
      map(({ enrollment }) => CertificateUploadActions.openDialog({ enrollmentId: enrollment.id })),
    );
  });

  finishExternalMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.finishExternalMission),
      switchMap(({ enrollment }) => this._enrollmentsAPI.fetchById(enrollment.id)),
      map((enrollment) => {
        return !enrollment.evaluated && enrollment.mission?.required_evaluation
          ? MissionEnrollmentsActions.openEvaluationDialog({ mission: { ...enrollment.mission, enrollment } })
          : MissionEnrollmentsActions.openAttachCertificate({ enrollment });
      }),
    );
  });

  openEvaluationDialog$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionEnrollmentsActions.openEvaluationDialog),
        tap(({ mission }) => this._evaluationService.openEvaluationDialog(mission)),
      );
    },
    { dispatch: false },
  );

  executeAction = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.executeAction),
      map(({ action, payload }) => {
        const runAction: Partial<Record<MissionDoneActionType, any>> = {
          [MissionDoneActionType.RESTART]: ({ id, goalDate }: { id: string; goalDate: string }) =>
            MissionEnrollmentsActions.restartEnrollment({ id, goalDate }),

          [MissionDoneActionType.EXTEND_DEADLINE]: ({ id }: { id: string }) =>
            MissionEnrollmentsActions.requestExtendDeadline({ id }),

          [MissionDoneActionType.EXTEND_DEADLINE_ADMIN]: ({ id, goalDate }: { id: string; goalDate: string }) =>
            MissionEnrollmentsActions.extendGoalDateEnrollment({ id, goalDate }),

          [MissionDoneActionType.REJECT_CERTIFICATE]: ({ id, message }: { id: string; message: string }) =>
            MissionEnrollmentsActions.rejectEnrollmentCertificate({ id, message }),

          [MissionDoneActionType.DELETE]: ({ id }: { id: string }) =>
            MissionEnrollmentsActions.deleteEnrollment({ id }),

          [MissionDoneActionType.CONTINUE]: (enrollment: Enrollment) =>
            MissionEnrollmentsActions.viewMission({ enrollment }),

          [MissionDoneActionType.VIEW_MISSION]: (enrollment: Enrollment) =>
            MissionEnrollmentsActions.viewMission({ enrollment }),

          [MissionDoneActionType.APPROVE_CERTIFICATE]: ({ id, performance }: { id: string; performance: number }) =>
            MissionEnrollmentsActions.approveEnrollmentCertificate({ id, performance }),

          [MissionDoneActionType.APPROVE_ENROLLMENT]: ({
            id,
            performance,
            status,
          }: {
            id: string;
            performance: number;
            status: EnrollmentStatuses;
          }) => MissionEnrollmentsActions.approveEnrollment({ id, performance, status }),

          [MissionDoneActionType.RE_ENROLL]: ({
            id,
            goalDate,
            userId,
          }: {
            id: string;
            goalDate: string;
            userId: string;
          }) => MissionEnrollmentsActions.reEnrollEnrollment({ id, goalDate, userId }),

          [MissionDoneActionType.GIVE_UP]: ({ id, message }: { id: string; message: string }) =>
            MissionEnrollmentsActions.giveUpEnrollment({ id, message }),

          [MissionDoneActionType.ATTACH_CERTIFICATE]: (enrollment: Enrollment) =>
            MissionEnrollmentsActions.finishExternalMission({ enrollment }),

          [MissionDoneActionType.APPROVE_PRESENTIAL_LIVE_ENROLLMENT]: ({ id }: { id: string }) =>
            MissionEnrollmentsActions.setPresentialLiveApproval({ id, approved: true }),

          [MissionDoneActionType.REFUSE_ENROLLMENT]: ({ id }: { id: string }) =>
            MissionEnrollmentsActions.setPresentialLiveApproval({ id, approved: false }),

          [MissionDoneActionType.FINISH_ENROLLMENT]: ({ id }: { id: string }) =>
            MissionEnrollmentsActions.finishPresentialLive({ id }),

          [MissionDoneActionType.RETAKE]: ({ id, goalDate }: { id: string; goalDate: string }) =>
            MissionEnrollmentsActions.retakeEnrollment({ id, goalDate }),

          [MissionDoneActionType.OPEN_MISSION]: (enrollment: Enrollment) =>
            MissionEnrollmentsActions.openMission({ enrollment }),
        };

        if (runAction[action]) {
          return runAction[action](payload);
        }
      }),
    );
  });

  fetchMoreItems$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.fetchMoreItems),
      concatLatestFrom(() => [
        this.store.select(fromSelectors.selectFilter),
        this.store.select(fromSelectors.selectFilterByAllUsers),
        this.store.select(fromSelectors.selectSort),
        this.store.select(fromSelectors.selectIsCourse),
        this.store.select(cyclesFeature.selectIsNormativeActive),
        this.store.select(globalSettingsFeature.selectBlockReEnrollment),
        this.store.select(fromSelectors.selectIsContentCreator),
        this.store.select(fromSelectors.selectIsFinished),
      ]),
      filter(
        ([
          _,
          _filter,
          _filteringAllUsers,
          _sortParams,
          _isCourse,
          _isNormativeActive,
          _blockReEnrollment,
          _isContentCreator,
          isFinished,
        ]) => !isFinished,
      ),
      map(
        ([
          _,
          filter,
          filteringAllUsers,
          sortParams,
          isCourse,
          isNormativeActive,
          blockReEnrollment,
          isContentCreator,
        ]) => ({
          filter: this._enrollmentsService.buildFilter(
            filter,
            filteringAllUsers || false,
            isCourse,
            isContentCreator,
            sortParams,
          ),
          isNormativeActive,
          blockReEnrollment,
        }),
      ),
      switchMap(({ filter, isNormativeActive, blockReEnrollment }) => {
        return this._missionService.fetchEnrollmentMissions(filter).pipe(
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
            MissionEnrollmentsActions.fetchMoreItemsSuccess({ enrollments, count: count ?? 0, next }),
          ),
        );
      }),
    );
  });

  fetchStatusOptions$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionEnrollmentsActions.fetchStatusOptions),
      map(({ enrollmentType }) => {
        const statuses = this._enrollmentsFilterService.getStatusOptions(enrollmentType);
        return MissionEnrollmentsActions.fetchStatusOptionsSuccess({ statuses });
      }),
    );
  });

  openMission$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionEnrollmentsActions.openMission),
        tap(({ enrollment }) => this._enrollmentsService.openMission(enrollment)),
      );
    },
    { dispatch: false },
  );
}
