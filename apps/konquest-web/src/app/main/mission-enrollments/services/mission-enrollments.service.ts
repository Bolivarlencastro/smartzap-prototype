import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { Pagination } from '@core/model';
import { Enrollment, EnrollmentFilter } from '@core/model/enrollment.model';
import {
  AuthService,
  EnrollmentStatuses,
  KeepsUtils,
  SortParams,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { KpSnackLoadingComponent } from '@keeps-platform-frontend-workspace/ui/kp-snack-loading';
import { Action } from '@ngrx/store';
import { TranslocoService } from '@jsverse/transloco';
import { Step } from 'app/main/learning-trail/model/learning-trail';
import { EnrollmentTrackingDialogComponent } from 'app/shared/components/enrollment-tracking-dialog/enrollment-tracking-dialog.component';
import { ReportService } from 'app/shared/services/report.service';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, finalize, map, switchMap, tap } from 'rxjs/operators';
import * as EnrollmentsActions from '../store/mission-enrollments.actions';
import { environment } from 'environments/environment';
import { differenceInDays, format, startOfDay } from 'date-fns';
import { navigateToEvent, navigateToMission } from '@app/shared/services';
import { isEvent } from '@app/shared/utils/event.utils';
import { LinkedLearningTrailsComponent } from '../components/linked-learning-trails-dialog/linked-learning-trails-dialog.component';
import { MissionsEnrollmentsDialogComponent } from '../components/missions-enrollments-dialog/missions-enrollments-dialog.component';
import { CalculateConsumptionStatus, MissionDoneActionType } from '../consts';
import { MissionModel } from '@app/main/mission/mission.model';

@Injectable()
export class MissionEnrollmentsService {
  constructor(
    private readonly _learningTrailApi: LearningTrailAPI,
    private readonly _dialog: MatDialog,
    private readonly _router: Router,
    private readonly _fuseLoadingService: FuseLoadingService,
    private readonly _translateService: TranslocoService,
    private readonly _enrollmentsAPI: MissionEnrollmentsAPI,
    private readonly _snackBar: MatSnackBar,
    private readonly _reportService: ReportService,
    private readonly _authService: AuthService,
    private readonly _userProfileService: UserProfileService,
  ) {}

  loadEnrollmentsSuccess(
    enrollments: Enrollment[],
    displayAdminOptions: boolean,
    isNormativeActive: boolean,
    blockReEnrollment: boolean,
  ): Enrollment[] {
    if (!enrollments) {
      return [];
    }
    return enrollments.map((enrollment) =>
      this.buildEnrollment(enrollment, !!displayAdminOptions, isNormativeActive, blockReEnrollment),
    );
  }

  getLearningTrailSteps(missionId: string): Observable<Action> {
    return this._learningTrailApi.getLearningTrailSteps({ mission: missionId }).pipe(
      tap(() => this._fuseLoadingService.show()),
      switchMap(({ results }: Pagination<Step>) => {
        const dialogRef = this._dialog.open(LinkedLearningTrailsComponent, {
          minWidth: '70%',
          data: results,
        });

        this._fuseLoadingService.hide();

        return dialogRef.afterClosed();
      }),
      exhaustMap(({ row, results }) => {
        if (row) {
          this._router.navigate(['/learning-trails', row.learning_trail?.id, 'details']);
        }

        return of(EnrollmentsActions.loadLinkedLearningTrailsSuccess({ payload: results }));
      }),
      finalize(() => this._fuseLoadingService.hide()),
      catchError((error) => of(EnrollmentsActions.loadLinkedLearningTrailsFailure(error))),
    );
  }

  openEnrollmentsByUser(enrollments: Enrollment[]): void {
    this._dialog.open(MissionsEnrollmentsDialogComponent, {
      data: enrollments,
      minWidth: '60%',
    });
  }

  fetchTracking(enrollment: Enrollment): Observable<Action> {
    return this._enrollmentsAPI.fetchTracking(enrollment.id).pipe(
      tap(() => this._fuseLoadingService.show()),
      switchMap((tracking) => {
        const trackingDialogRef = this._dialog.open(EnrollmentTrackingDialogComponent, {
          maxHeight: '95vh',
          data: {
            trackingTitle: this._translateService.translate(
              'ENROLLMENTS.TITLE.' + MissionDoneActionType.VIEW_ACTIVITIES,
            ),
            tracking: tracking.map((track) => {
              return {
                ...track,
                consumption_status: CalculateConsumptionStatus(track),
              };
            }),
            viewText: marker('ENROLLMENT.TRACKING.VIEW_MISSION'),
            enrollment,
          },
        });

        this._fuseLoadingService.hide();

        return trackingDialogRef.afterClosed();
      }),
      exhaustMap((enrollment) => {
        if (enrollment) {
          return of(EnrollmentsActions.viewMission({ enrollment }));
        }

        return of(EnrollmentsActions.loadTrackingSuccess());
      }),
      finalize(() => this._fuseLoadingService.hide()),
      catchError((error) => of(EnrollmentsActions.loadTrackingFailure({ error }))),
    );
  }

  generateCertificate(id: string, isMobile = false): Observable<Action> {
    this._snackBar.openFromComponent(KpSnackLoadingComponent, {
      data: { message: 'GENERAL.LOADING_CERTIFICATE' },
      horizontalPosition: 'center',
      panelClass: ['bg-white', 'text-black', 'text-base', 'rounded-md'],
    });

    return this._reportService.generateCourseCertificate(id).pipe(
      tap(({ certificate_url }) => {
        this._snackBar.dismiss();

        if (isMobile) {
          window.open(certificate_url, 'blank');
        } else {
          this._reportService.openCertificate(certificate_url);
        }
      }),
      map(() => EnrollmentsActions.generateCertificateSuccess()),
      catchError((error) => {
        this._snackBar.dismiss();
        return of(EnrollmentsActions.generateCertificateFailure(error));
      }),
    );
  }

  buildFilter(
    currentFilter: EnrollmentFilter,
    filteringAllUsers: boolean,
    isCourse: boolean,
    isContentCreator: boolean,
    sortParams?: SortParams | null,
  ): EnrollmentFilter {
    const sort = sortParams?.direction ? KeepsUtils.buildSort(sortParams) : '-required,goal_date,-created_date';
    const mission_model = isCourse ? 'INTERNAL,EXTERNAL_PROVIDER,SCORM' : 'LIVE,PRESENTIAL';

    if (filteringAllUsers) {
      const userId = this._authService.userId;

      return {
        ...currentFilter,
        ordering: sort,
        mission_model,
        ...(isContentCreator && { mission__user_creator: userId }),
      } as EnrollmentFilter;
    }

    return {
      ...currentFilter,
      user: this._authService.userId,
      ordering: sort,
      mission_model,
    } as EnrollmentFilter;
  }

  openMission(enrollment: Enrollment): void {
    if (enrollment.mission?.mission_model === MissionModel.EXTERNAL_PROVIDER) {
      KeepsUtils.openUrlInNewTab(enrollment.mission?.external?.course_url);
      return;
    }

    this._router.navigate(['/course', enrollment.mission?.id], {
      queryParams: {
        rollbackPath: ['/enrollments', 'missions'],
      },
    });
  }

  navigateToMission(enrollment: Enrollment): void {
    if (isEvent(enrollment?.mission?.mission_model)) {
      navigateToEvent(this._router, enrollment.mission.id);
      return;
    }

    navigateToMission(this._router, enrollment.mission.id);
  }

  approveEnrollment(id: string, actualStatus: EnrollmentStatuses, newPerformance: number): Observable<unknown> {
    newPerformance = KeepsUtils.fixNumber(newPerformance);
    if (actualStatus !== EnrollmentStatuses.REPROVED) {
      return this._enrollmentsAPI.approveEnrollment(id, newPerformance);
    }
    return this._enrollmentsAPI.changePerformance(id, newPerformance);
  }

  private buildEnrollment(
    enrollment: Enrollment,
    displayAdminOptions: boolean,
    isNormativeActive: boolean,
    blockReEnrollment: boolean,
  ): Enrollment {
    return {
      ...enrollment,
      id: enrollment.id,
      goalDate: enrollment.goal_date ? format(new Date(enrollment.goal_date), 'dd/MM/yyyy') : '',
      mission: enrollment.mission,
      provider: enrollment.mission?.provider,
      startDate: enrollment.start_date,
      endDate: enrollment.end_date,
      enrolledCount: enrollment.enrolled_count,
      performance: enrollment.performance,
      progress: enrollment.progress,
      points: enrollment.points,
      status: enrollment.status,
      user: enrollment.user,
      overdueDays: this.getOverdueDays(enrollment),
      actions: this.createActions(enrollment, displayAdminOptions, isNormativeActive, blockReEnrollment),
    } as Enrollment;
  }

  private getOverdueDays(enrollment: Enrollment): number {
    if (!enrollment.goal_date) return 0;
    const allowedStatuses = [EnrollmentStatuses.STARTED];
    if (!allowedStatuses.includes(enrollment.status)) return 0;
    const now = startOfDay(new Date());
    const goalDate = startOfDay(new Date(enrollment.goal_date));
    const diffInDays = differenceInDays(now, goalDate);
    return Math.max(0, diffInDays);
  }

  private createActions(
    enrollment: Enrollment,
    displayAdminOptions: boolean,
    isNormativeActive: boolean,
    blockReEnrollment: boolean,
  ): string[] {
    const missionModel = enrollment.mission?.mission_model;

    if (missionModel === MissionModel.PRESENTIAL || missionModel === MissionModel.LIVE) {
      return this.buildPresentialLiveActions(enrollment, displayAdminOptions);
    }

    return this.buildMissionActions(enrollment, displayAdminOptions, isNormativeActive, blockReEnrollment);
  }

  private buildMissionActions(
    enrollment: Enrollment,
    displayAdminOptions: boolean,
    isNormativeActive: boolean,
    blockReEnrollment: boolean,
  ): string[] {
    const normativesFeatureEnabled = environment.featureFlags['normatives'];
    const isContentCreator = this._userProfileService.hasRoles(['content']);
    const displayNormativeAction = normativesFeatureEnabled && isNormativeActive && !isContentCreator;

    const action: Partial<Record<EnrollmentStatuses, MissionDoneActionType[]>> = {
      [EnrollmentStatuses.COMPLETED]: [
        MissionDoneActionType.VIEW_ACTIVITIES,
        ...(!enrollment.required && !blockReEnrollment ? [MissionDoneActionType.RE_ENROLL] : []),
        ...(displayAdminOptions
          ? [
              ...(displayNormativeAction ? [MissionDoneActionType.LINK_CYCLE] : []),
              MissionDoneActionType.RESTART,
              ...(enrollment.required && !blockReEnrollment ? [MissionDoneActionType.RE_ENROLL] : []),
              MissionDoneActionType.DELETE,
            ]
          : [MissionDoneActionType.VIEW_MISSION]),
      ],
      [EnrollmentStatuses.REPROVED]: [
        MissionDoneActionType.VIEW_ACTIVITIES,
        ...(displayAdminOptions
          ? [
              ...(displayNormativeAction ? [MissionDoneActionType.LINK_CYCLE] : []),
              MissionDoneActionType.APPROVE_ENROLLMENT,
              ...(!blockReEnrollment ? [MissionDoneActionType.RE_ENROLL] : []),
              MissionDoneActionType.RESTART,
              MissionDoneActionType.DELETE,
            ]
          : [
              MissionDoneActionType.VIEW_MISSION,
              ...(!enrollment.required && !blockReEnrollment ? [MissionDoneActionType.RE_ENROLL] : []),
            ]),
      ],
      [EnrollmentStatuses.ENROLLED]: [
        ...(displayAdminOptions
          ? [
              ...(displayNormativeAction ? [MissionDoneActionType.LINK_CYCLE] : []),
              MissionDoneActionType.APPROVE_ENROLLMENT,
              MissionDoneActionType.DELETE,
            ]
          : [MissionDoneActionType.VIEW_MISSION, ...(!enrollment.required ? [MissionDoneActionType.GIVE_UP] : [])]),
      ],
      [EnrollmentStatuses.STARTED]: [
        MissionDoneActionType.VIEW_ACTIVITIES,
        ...(displayAdminOptions
          ? [
              ...(displayNormativeAction ? [MissionDoneActionType.LINK_CYCLE] : []),
              MissionDoneActionType.APPROVE_ENROLLMENT,
              MissionDoneActionType.DELETE,
            ]
          : [MissionDoneActionType.CONTINUE, ...(!enrollment.required ? [MissionDoneActionType.GIVE_UP] : [])]),
      ],
      [EnrollmentStatuses.EXPIRED]: [
        MissionDoneActionType.VIEW_ACTIVITIES,
        ...(displayAdminOptions
          ? [
              ...(displayNormativeAction ? [MissionDoneActionType.LINK_CYCLE] : []),
              ...(enrollment.required ? [MissionDoneActionType.EXTEND_DEADLINE_ADMIN] : []),
              MissionDoneActionType.DELETE,
            ]
          : [MissionDoneActionType.EXTEND_DEADLINE]),
      ],
      [EnrollmentStatuses.REQUEST_EXTENSION]: [
        MissionDoneActionType.VIEW_ACTIVITIES,
        ...(displayAdminOptions
          ? [
              ...(displayNormativeAction ? [MissionDoneActionType.LINK_CYCLE] : []),
              ...(enrollment.required ? [MissionDoneActionType.EXTEND_DEADLINE_ADMIN] : []),
            ]
          : []),
      ],
      [EnrollmentStatuses.PENDING_VALIDATION]: displayAdminOptions
        ? [
            ...(displayNormativeAction ? [MissionDoneActionType.LINK_CYCLE] : []),
            MissionDoneActionType.APPROVE_CERTIFICATE,
            MissionDoneActionType.REJECT_CERTIFICATE,
            MissionDoneActionType.HISTORY,
            MissionDoneActionType.DELETE,
          ]
        : [MissionDoneActionType.VIEW_MISSION],
      [EnrollmentStatuses.REFUSED]: displayAdminOptions
        ? [
            ...(displayNormativeAction ? [MissionDoneActionType.LINK_CYCLE] : []),
            MissionDoneActionType.APPROVE_CERTIFICATE,
            MissionDoneActionType.DELETE,
          ]
        : [MissionDoneActionType.VIEW_MISSION],
      [EnrollmentStatuses.INACTIVATED]: displayAdminOptions
        ? [MissionDoneActionType.APPROVE_ENROLLMENT, MissionDoneActionType.DELETE]
        : [],
      [EnrollmentStatuses.GIVE_UP]: displayAdminOptions
        ? [...(displayNormativeAction ? [MissionDoneActionType.LINK_CYCLE] : []), MissionDoneActionType.RETAKE]
        : [...(!enrollment.required ? [MissionDoneActionType.RETAKE] : [])],
    };

    const actions = action[enrollment.status] || [];

    if (enrollment.enrolled_count && enrollment.enrolled_count > 1) {
      actions.push(MissionDoneActionType.PREVIOUS_ENROLLMENTS);
    }

    if (
      enrollment.status !== EnrollmentStatuses.COMPLETED &&
      enrollment.status !== EnrollmentStatuses.PENDING_VALIDATION &&
      !(displayAdminOptions && enrollment.status === EnrollmentStatuses.INACTIVATED) &&
      !(displayAdminOptions && enrollment.status === EnrollmentStatuses.STARTED) &&
      !(displayAdminOptions && enrollment.status === EnrollmentStatuses.REFUSED) &&
      enrollment.mission?.mission_model === MissionModel.EXTERNAL_PROVIDER
    ) {
      actions.push(MissionDoneActionType.ATTACH_CERTIFICATE);
    }

    return actions;
  }

  private buildPresentialLiveActions(enrollment: Enrollment, displayAdminOptions: boolean): string[] {
    const enrollmentActions: Partial<Record<EnrollmentStatuses, MissionDoneActionType[]>> = {
      [EnrollmentStatuses.ENROLLED]: displayAdminOptions
        ? [MissionDoneActionType.VIEW_MISSION, MissionDoneActionType.FINISH_ENROLLMENT, MissionDoneActionType.DELETE]
        : [MissionDoneActionType.VIEW_MISSION],
      [EnrollmentStatuses.STARTED]: displayAdminOptions
        ? [MissionDoneActionType.FINISH_ENROLLMENT, MissionDoneActionType.DELETE]
        : [MissionDoneActionType.VIEW_MISSION],
      [EnrollmentStatuses.EXPIRED]: displayAdminOptions
        ? [MissionDoneActionType.VIEW_MISSION, MissionDoneActionType.APPROVE_PRESENTIAL_LIVE_ENROLLMENT]
        : [MissionDoneActionType.VIEW_MISSION],
      [EnrollmentStatuses.GIVE_UP]: displayAdminOptions
        ? [MissionDoneActionType.DELETE]
        : [MissionDoneActionType.VIEW_MISSION],
      [EnrollmentStatuses.REFUSED]: displayAdminOptions
        ? [MissionDoneActionType.DELETE]
        : [MissionDoneActionType.VIEW_MISSION],
      [EnrollmentStatuses.REPROVED]: displayAdminOptions
        ? [MissionDoneActionType.DELETE]
        : [MissionDoneActionType.VIEW_MISSION],
      [EnrollmentStatuses.COMPLETED]: [MissionDoneActionType.VIEW_MISSION],
    };

    return enrollmentActions[enrollment.status] || [];
  }
}
