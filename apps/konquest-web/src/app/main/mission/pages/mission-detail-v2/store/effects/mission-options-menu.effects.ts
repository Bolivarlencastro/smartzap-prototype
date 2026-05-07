import { Injectable } from '@angular/core';
import { EvaluationService } from '@app/main/evaluation/evaluation.service';
import { AuthService, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { CourseEvaluationActions } from 'app/main/evaluation/store';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { CertificateUploadActions } from 'app/shared/components/certificate-upload';
import { UserProfileActions } from 'app/shared/store';
import { UserProfileSelectors } from 'app/shared/store/selectors';
import { of } from 'rxjs';
import { catchError, distinct, filter, map, switchMap, tap } from 'rxjs/operators';
import { MissionOptionsMenuService } from '../../services/mission-options-menu.service';
import { MissionDetailActions, MissionOptionsMenuActions } from '../actions';
import { MissionDetailSelectors } from '../selectors';

@Injectable()
export class MissionOptionsMenuEffects {
  setMissionActions$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        MissionDetailActions.loadMissionSuccess,
        MissionOptionsMenuActions.enrollToPresentialLiveMissionSuccess,
        MissionOptionsMenuActions.giveUpSuccess,
        MissionOptionsMenuActions.finishPresentialLiveMission,
        CertificateUploadActions.uploadCertificateSuccess,
        CourseEvaluationActions.postEvaluationSuccess,
        UserProfileActions.setUserProfileData,
      ),
      concatLatestFrom(() => [
        this.store.select(MissionDetailSelectors.selectMission),
        this.store.select(UserProfileSelectors.selectIsAdmin),
        this.store.select(UserProfileSelectors.selectIsSuperAdmin),
      ]),
      filter(([_, mission, _isAdmin, _isSuperAdmin]) => !!mission),
      map(([_, mission, isAdmin, isSuperAdmin]) => {
        const actions = this._missionOptionsMenuService.buildMissionActions(mission, isAdmin, isSuperAdmin);
        return MissionDetailActions.setMissionActions({ actions });
      }),
    );
  });

  executeAction$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.executeAction),
      map(({ action }) => MissionOptionsMenuService.getAction(action.id)),
    );
  });

  redirectTo$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.redirectTo),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
      tap(([{ redirectType }, mission]) => this._missionOptionsMenuService.redirectTo(redirectType, mission)),
      map(() => MissionDetailActions.closeMissionDetails()),
    );
  });

  finishExternalMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.finishExternalMission),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
      map(([_, mission]) => {
        const enrollment = mission.enrollment;
        return !enrollment.evaluated && mission?.required_evaluation
          ? MissionOptionsMenuActions.openEvaluationDialog()
          : MissionOptionsMenuActions.openAttachCertificate();
      }),
    );
  });

  openEvaluationDialog$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionOptionsMenuActions.openEvaluationDialog),
        concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
        tap(([_, mission]) => this._evaluationService.openEvaluationDialog(mission)),
      );
    },
    { dispatch: false },
  );

  openAttachCertificate$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.openAttachCertificate),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
      map(([_, mission]) => CertificateUploadActions.openDialog({ enrollmentId: mission.enrollment.id })),
    );
  });

  giveUp$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.giveUp),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMissionEnrollment)),
      switchMap(([_, enrollment]) => {
        return this._missionOptionsMenuService.openGiveUpDialog().pipe(
          filter((message) => !!message),
          switchMap((message) => {
            return this._missionService.missionGiveUp(enrollment.id, message).pipe(
              map((updatedEnrollment) => MissionOptionsMenuActions.giveUpSuccess({ enrollment: updatedEnrollment })),
              catchError(() => of(MissionOptionsMenuActions.giveUpFailure())),
            );
          }),
        );
      }),
    );
  });

  openCertificateHistory$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionOptionsMenuActions.certificateHistory),
        concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
        map(([_, mission]) => this._missionOptionsMenuService.openCertificateHistory(mission)),
      );
    },
    { dispatch: false },
  );

  enrollToMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.enrollToMission),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
      distinct(([_, { id }]) => id),
      switchMap(([_, mission]) => {
        return this._missionService.enroll(mission.id, this._authService.userId).pipe(
          map((updatedEnrollment) =>
            MissionOptionsMenuActions.enrollToMissionSuccess({ enrollment: updatedEnrollment }),
          ),
          catchError(() => of(MissionOptionsMenuActions.enrollToMissionFailure())),
        );
      }),
    );
  });

  retakeMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.retakeMission),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
      switchMap(([_, mission]) => {
        return this._missionService.missionRetake(mission.enrollment.id).pipe(
          map(() => MissionOptionsMenuActions.retakeMissionSuccess()),
          catchError(() => of(MissionOptionsMenuActions.retakeMissionFailure())),
        );
      }),
    );
  });

  onEnrollmentSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.enrollToMissionSuccess, MissionOptionsMenuActions.retakeMissionSuccess),
      map(() => MissionOptionsMenuActions.redirectTo({ redirectType: 'open-mission' })),
    );
  });

  retakeMissionSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.retakeMissionSuccess),
      map(() => MissionDetailActions.reloadMission()),
    );
  });

  finishPresentialLiveMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.finishPresentialLiveMission),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
      switchMap(([_, mission]) => {
        return this._missionService.finishMission(mission.id, mission.mission_model).pipe(
          map(() => MissionDetailActions.closeMissionDetails()),
          catchError(() => of(MissionOptionsMenuActions.finishPresentialLiveMissionFailure())),
        );
      }),
    );
  });

  enrollToPresentialLiveMission$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.enrollToPresentialLiveMission),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
      switchMap(([_, mission]) => {
        return this._missionService.enrollToLivePresentialMission(mission.id, this._authService.userId).pipe(
          map((enrollment) => MissionOptionsMenuActions.enrollToPresentialLiveMissionSuccess({ enrollment })),
          catchError(() => of(MissionOptionsMenuActions.enrollToPresentialLiveMissionFailure())),
        );
      }),
    );
  });

  generateCertificate$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.generatePresentialLiveCertificate),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMissionEnrollment)),
      switchMap(([{ id }, enrollment]) => {
        if (id) {
          return of(id);
        }
        return enrollment.status !== EnrollmentStatuses.COMPLETED
          ? this._missionService.syncFinishEnrollmentMission(enrollment.id).pipe(map(() => enrollment.id))
          : of(enrollment.id);
      }),
      switchMap((enrollmentId) =>
        this._missionService
          .generateCertificate(enrollmentId)
          .pipe(catchError(() => of(MissionOptionsMenuActions.generatePresentialLiveCertificateFailure()))),
      ),
    );
  });

  enterToLiveEventEnrolled$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(MissionOptionsMenuActions.enterToLiveEventEnrolled),
        concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
        tap(([_, mission]) => window.open(mission?.live?.url)),
      );
    },
    { dispatch: false },
  );

  enterToLiveEventNotEnrolled$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.enterToLiveEventNotEnrolled),
      concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
      tap(([_, mission]) => window.open(mission?.live?.url)),
      switchMap(([_, mission]) => {
        return this._missionService.enrollToLivePresentialMission(mission.id, this._authService.userId).pipe(
          map((enrollment) => MissionOptionsMenuActions.enterToLiveEventNotEnrolledSuccess({ enrollment })),
          catchError(() => of(MissionOptionsMenuActions.enrollToPresentialLiveMissionFailure())),
        );
      }),
    );
  });

  enterToLiveEventNotEnrolledSuccess$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(MissionOptionsMenuActions.enterToLiveEventNotEnrolledSuccess),
      map(({ enrollment }) => MissionOptionsMenuActions.enrollToPresentialLiveMissionSuccess({ enrollment })),
    );
  });

  markAsPresentToLiveMission$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(
          MissionOptionsMenuActions.enterToLiveEventEnrolled,
          MissionOptionsMenuActions.enterToLiveEventNotEnrolledSuccess,
        ),
        concatLatestFrom(() => this.store.select(MissionDetailSelectors.selectMission)),
        filter(([_, mission]) => !!mission?.live?.auto_attendance),
        switchMap(([_, mission]) => this._missionService.markAsPresentToLiveMission(mission?.live?.dates)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private _actions$: Actions,
    private store: Store,
    private _evaluationService: EvaluationService,
    private _missionService: MissionServiceV2,
    private _missionOptionsMenuService: MissionOptionsMenuService,
    private _authService: AuthService,
  ) {}
}
