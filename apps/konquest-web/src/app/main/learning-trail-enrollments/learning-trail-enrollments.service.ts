import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LearningTrailEnrollmentsAPI } from '@core/api/learning-trail-enrollments.api';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import { Enrollment, EnrollmentFilter, ExtendDeadlineDialogData, TrackStep } from '@core/model/enrollment.model';
import {
  AuthService,
  EnrollmentStatuses,
  KeepsUtils,
  SortParams,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpSnackLoadingComponent } from '@keeps-platform-frontend-workspace/ui/kp-snack-loading';
import { Action, Store } from '@ngrx/store';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ExtendDeadlineDialogComponent } from 'app/main/mission-enrollments/components/extend-deadline-dialog/extend-deadline-dialog.component';
import { EnrollmentTrackingDialogComponent } from 'app/shared/components/enrollment-tracking-dialog/enrollment-tracking-dialog.component';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { navigateToTrail } from 'app/shared/services';
import { ReportService } from 'app/shared/services/report.service';
import { differenceInDays, format, startOfDay } from 'date-fns';
import { environment } from 'environments/environment';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, exhaustMap, filter, map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { LearningTrail, Step } from '../learning-trail/model/learning-trail';
import { Mission } from '../mission/mission.model';
import { CalculateConsumptionStatus, LearningTrailDoneActionType } from './consts';
import * as EnrollmentsActions from './store/learning-trail-enrollments.actions';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';

@Injectable()
export class LearningTrailEnrollmentsService {
  constructor(
    private readonly _dialog: MatDialog,
    private readonly _router: Router,
    private readonly _translateService: TranslocoService,
    private readonly _enrollmentsAPI: LearningTrailEnrollmentsAPI,
    private readonly _missionEnrollmentsAPI: MissionEnrollmentsAPI,
    private readonly store: Store,
    private readonly _snackBar: MatSnackBar,
    private readonly _reportService: ReportService,
    private readonly _authService: AuthService,
    private readonly messageService: KpMessageService,
    private readonly learningTrailAPI: LearningTrailAPI,
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
      this.buildEnrollment(enrollment, displayAdminOptions, isNormativeActive, blockReEnrollment),
    );
  }

  fetchTracking(enrollment: Enrollment): Observable<Action> {
    return forkJoin({
      track: this._enrollmentsAPI.fetchTracking(enrollment.id),
      learning_trail: this.learningTrailAPI.getById(enrollment.learning_trail.id),
    }).pipe(
      map(({ track, learning_trail }) => this.buildExternalCourseTracking(track, learning_trail)),
      mergeMap((track) => track),
      map((track) => this.buildTrackContents(track, enrollment)),
      toArray(),
      switchMap((contents$) => forkJoin(contents$)),
      map((tracking) => this.buildTrackingDialogData(tracking, enrollment)),
      switchMap((data) => this.openTrackingDialog(data)),
      exhaustMap((enrollment) => this.handleTrackingDilogClose(enrollment)),
      catchError((error) => of(EnrollmentsActions.loadTrackingFailure({ error }))),
    );
  }

  private handleTrackingDilogClose(enrollment: Enrollment) {
    if (enrollment) {
      this.store.dispatch(EnrollmentsActions.viewLearningTrail({ enrollment }));
    }

    return of(EnrollmentsActions.loadTrackingSuccess());
  }

  generateCertificate(enrollmentId: string, isMobile = false): Observable<Action> {
    this._snackBar.openFromComponent(KpSnackLoadingComponent, {
      data: { message: 'GENERAL.LOADING_CERTIFICATE' },
      horizontalPosition: 'center',
      panelClass: ['bg-white', 'text-black', 'text-base', 'rounded-md'],
    });

    return this._reportService.generateLearningTrailCertificate(enrollmentId).pipe(
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

  viewLearningTrail(enrollment: Enrollment): void {
    navigateToTrail(this._router, enrollment.learning_trail.id);
  }

  buildFilter(
    currentFilter: EnrollmentFilter,
    filteringAllUsers: boolean,
    isContentCreator: boolean,
    sortParams?: SortParams,
  ): EnrollmentFilter {
    const sort = sortParams?.direction ? KeepsUtils.buildSort(sortParams) : '';

    if (filteringAllUsers) {
      const userId = this._authService.userId;

      return { ...currentFilter, ordering: sort, ...(isContentCreator && { learning_trail__user_creator: userId }) };
    }

    return { ...currentFilter, user: this._authService.userId, ordering: sort };
  }

  extendDeadline(enrollmentId: string, newGoalDate: string) {
    return this._enrollmentsAPI.extendDeadline(enrollmentId, newGoalDate).pipe(
      tap({
        next: () => this.messageService.success(marker('ENROLLMENTS.EXTEND_SUCCESS')),
        error: () => this.messageService.error(marker('ENROLLMENTS.EXTEND_FAILURE')),
      }),
    );
  }

  openExtendDeadlineDialog(data: ExtendDeadlineDialogData) {
    return this._dialog
      .open<ExtendDeadlineDialogComponent, ExtendDeadlineDialogData, string>(ExtendDeadlineDialogComponent, {
        autoFocus: false,
        width: '500px',
        disableClose: true,
        data,
      })
      .afterClosed();
  }

  approveEnrollment(id: string, newPerformance: number): Observable<unknown> {
    newPerformance = KeepsUtils.fixNumber(newPerformance);
    return this._enrollmentsAPI.approveEnrollment(id, newPerformance);
  }

  giveUp(enrollmentId: string): Observable<unknown> {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: 600 });
    dialogRef.componentInstance.confirmTitle = 'LEARNING_TRAIL.DETAIL.GIVE_UP_CONFIRMATION.TITLE';
    dialogRef.componentInstance.confirmMessage = 'LEARNING_TRAIL.DETAIL.GIVE_UP_CONFIRMATION.MESSAGE';
    return dialogRef.afterClosed().pipe(
      filter((value) => value === true),
      switchMap(() => this._enrollmentsAPI.enrollGiveUp(enrollmentId)),
    );
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
      goalDate: enrollment.goal_date ? format(new Date(enrollment.goal_date), 'P') : '',
      learning_trail: enrollment.learning_trail,
      startDate: enrollment.start_date,
      endDate: enrollment.end_date,
      enrolledCount: enrollment.enrolled_count,
      performance: enrollment.performance,
      progress: enrollment.progress,
      points: enrollment.points,
      status: enrollment.status,
      user: enrollment.user,
      overdueDays: this.getOverdueDays(enrollment),
      actions: this.buildTrailEnrollmentActions(enrollment, displayAdminOptions, isNormativeActive, blockReEnrollment),
    } as Enrollment;
  }

  private buildTrackContents(track: TrackStep, enrollment: Enrollment) {
    const { step_type, mission_enrollment_id } = track;

    if (step_type === 'MISSION' && !mission_enrollment_id) {
      return of({ track, contents: [] });
    }

    if (step_type === 'MISSION') {
      return this._missionEnrollmentsAPI
        .fetchTracking(mission_enrollment_id)
        .pipe(map((contents) => ({ track, contents })));
    }

    return this._enrollmentsAPI
      .fetchTrackingFromPulse(enrollment.id, track.id)
      .pipe(map((content) => ({ track, contents: [content] })));
  }

  private openTrackingDialog(data: any): Observable<any> {
    return this._dialog
      .open(EnrollmentTrackingDialogComponent, {
        data,
      })
      .afterClosed();
  }

  private buildTrackingDialogData(tracking: any, enrollment: Enrollment) {
    return {
      trackingTitle: this._translateService.translate(
        'ENROLLMENTS.TITLE.' + LearningTrailDoneActionType.VIEW_ACTIVITIES,
      ),
      tracking: tracking.map((track) => {
        return {
          ...track,
          contents: track.contents.map((content) => ({
            ...content,
            consumption_status: CalculateConsumptionStatus(content),
          })),
        };
      }),
      viewText: marker('ENROLLMENT.TRACKING.VIEW_TRAIL'),
      enrollment,
    };
  }

  private getOverdueDays(enrollment: Enrollment): number {
    const parsedDate = new Date(enrollment.goal_date);
    if (!enrollment.goal_date) return 0;
    const allowedStatuses = [EnrollmentStatuses.STARTED];
    if (!allowedStatuses.includes(enrollment.status)) return 0;
    const now = startOfDay(new Date());
    const goalDate = startOfDay(parsedDate);
    const diffInDays = differenceInDays(now, goalDate);
    return diffInDays > 0 ? Math.floor(diffInDays) : 0;
  }

  private buildTrailEnrollmentActions(
    enrollment: Enrollment,
    displayAdminOptions: boolean,
    isNormativeActive: boolean,
    blockReEnrollment: boolean,
  ): string[] {
    const normativesFeatureEnabled = environment.featureFlags['normatives'];
    const isContentCreator = this._userProfileService.hasRoles(['content']);
    const displayNormativeAction = normativesFeatureEnabled && isNormativeActive && !isContentCreator;

    const action: Partial<Record<EnrollmentStatuses, LearningTrailDoneActionType[]>> = {
      [EnrollmentStatuses.STARTED]: displayAdminOptions
        ? [
            ...(displayNormativeAction ? [LearningTrailDoneActionType.LINK_CYCLE] : []),
            LearningTrailDoneActionType.VIEW_ACTIVITIES,
            LearningTrailDoneActionType.APPROVE_ENROLLMENT,
            LearningTrailDoneActionType.EXTEND_DEADLINE,
            LearningTrailDoneActionType.DELETE,
          ]
        : [LearningTrailDoneActionType.VIEW_TRAIL],
      [EnrollmentStatuses.ENROLLED]: displayAdminOptions
        ? [
            ...(displayNormativeAction ? [LearningTrailDoneActionType.LINK_CYCLE] : []),
            LearningTrailDoneActionType.EXTEND_DEADLINE,
            LearningTrailDoneActionType.APPROVE_ENROLLMENT,
            LearningTrailDoneActionType.DELETE,
          ]
        : [LearningTrailDoneActionType.VIEW_TRAIL],
      [EnrollmentStatuses.COMPLETED]: displayAdminOptions
        ? [
            ...(displayNormativeAction ? [LearningTrailDoneActionType.LINK_CYCLE] : []),
            LearningTrailDoneActionType.VIEW_ACTIVITIES,
            LearningTrailDoneActionType.DELETE,
          ]
        : [LearningTrailDoneActionType.VIEW_TRAIL],
      [EnrollmentStatuses.ENROLLMENT_REPROVED]: displayAdminOptions
        ? [
            ...(displayNormativeAction ? [LearningTrailDoneActionType.LINK_CYCLE] : []),
            LearningTrailDoneActionType.DELETE,
          ]
        : [LearningTrailDoneActionType.VIEW_TRAIL],
      [EnrollmentStatuses.GIVE_UP]: displayAdminOptions
        ? [
            ...(displayNormativeAction ? [LearningTrailDoneActionType.LINK_CYCLE] : []),
            LearningTrailDoneActionType.RESTART,
            LearningTrailDoneActionType.DELETE,
          ]
        : [LearningTrailDoneActionType.VIEW_TRAIL],
      [EnrollmentStatuses.REPROVED]: displayAdminOptions
        ? [
            ...(displayNormativeAction ? [LearningTrailDoneActionType.LINK_CYCLE] : []),
            LearningTrailDoneActionType.VIEW_ACTIVITIES,
            ...(!blockReEnrollment ? [LearningTrailDoneActionType.RE_ENROLL] : []),
            LearningTrailDoneActionType.RESTART,
            LearningTrailDoneActionType.DELETE,
          ]
        : [LearningTrailDoneActionType.VIEW_TRAIL],
    };

    return action[enrollment.status] || [];
  }

  private buildExternalCourseTracking(track: TrackStep[], learningTrail: LearningTrail): TrackStep[] {
    const stepsMap = new Map<string, Mission>(
      learningTrail.steps.map((step: Step) => [step?.mission?.id, step?.mission]),
    );
    return track.map((t: TrackStep) => {
      if (t.step_type === 'MISSION') {
        const step = stepsMap.get(t.id);
        return { ...t, external_course: !!step?.external_course_url };
      }
      return t;
    });
  }
}
