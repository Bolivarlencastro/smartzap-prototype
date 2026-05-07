import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, DOCUMENT, NgClass, NgStyle } from '@angular/common';
import { Component, Inject, OnDestroy, Renderer2, Signal } from '@angular/core';
import { MatDialog, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Mission, MissionModel } from '@app/main/mission/mission.model';
import { MissionActionId } from '@app/main/mission/pages/mission-detail-v2/builders';
import { VinculateToGroupActions } from '@app/shared/store';
import { PulseService } from '@core/api';
import { AuthService, KeepsUtils, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpResume, KpResumeComponent } from '@keeps-platform-frontend-workspace/ui/kp-resume';
import { RouteDetailDialogWrapper } from '@keeps-platform-frontend-workspace/ui/kp-route-detail-dialog-wrapper';
import { KpTitle, KpTitleComponent } from '@keeps-platform-frontend-workspace/ui/kp-title';
import { LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { TrailDetailHelper } from 'app/main/learning-trail/pages/detail/trail-detail-helper';
import { TransferContentType } from 'app/main/transfer-dialog/models';
import { TransferDialogActions } from 'app/main/transfer-dialog/store/actions';
import { BatchEnrollmentsActions } from 'app/shared/components/batch-enrollment-dialog';
import { environment } from 'environments/environment';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { LearningTrail, LearningTrailEnrollment, Step } from '../../model/learning-trail';
import * as fromActions from './store/learning-trail-detail.actions';
import * as fromSelectors from './store/learning-trail-detail.selectors';
import {
  KpLearningTrailDetailStepsComponent,
  StepCertificate,
} from '@keeps-platform-frontend-workspace/ui/kp-learning-trail-detail-steps';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput } from '@angular/material/datepicker';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { KpDescriptionComponent } from 'app/shared/components';
import { TranslocoPipe } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

marker('LEARNING_TRAIL.DETAIL.TOOLTIP.START');
marker('LEARNING_TRAIL.DETAIL.TOOLTIP.RETAKE');
marker('LEARNING_TRAIL.DETAIL.START');
marker('LEARNING_TRAIL.DETAIL.RETAKE');

@Component({
  selector: 'app-learning-trail-detail',
  templateUrl: './learning-trail-detail.component.html',
  animations: fuseAnimations,
  imports: [
    MatDialogTitle,
    NgStyle,
    NgClass,
    KpCardTagComponent,
    MatIconButton,
    MatDialogClose,
    MatIcon,
    KpResumeComponent,
    MatDialogContent,
    KpTitleComponent,
    MatButton,
    MatInput,
    FormsModule,
    MatDatepickerInput,
    MatTooltip,
    MatDatepicker,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    KpDescriptionComponent,
    KpLearningTrailDetailStepsComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class LearningTrailDetailComponent
  extends RouteDetailDialogWrapper<LearningTrailDetailComponent>
  implements OnDestroy
{
  learningTrail$: Observable<LearningTrail | undefined>;
  learningTrailSteps$: Observable<Step[]>;
  enroll$: Observable<LearningTrailEnrollment | undefined>;
  enrolled$: Observable<boolean>;
  canGiveUp$: Observable<boolean | '' | undefined>;
  canGenerateCertificate$: Observable<boolean>;
  canRetake$: Observable<boolean>;
  enrollButtonDisabled$: Observable<boolean>;
  isMobile$: Observable<boolean>;
  learningTrailTags$: Observable<LearnContentCardTag[]>;
  resumeItems$: Observable<KpResume[]>;
  canEditDescription$: Observable<boolean>;
  protected readonly titleInfo$: Observable<KpTitle>;
  lastContentItem: Signal<{ type: string; step: Step }>;

  learningTrailDurationTime: number | undefined = 0;
  expirationDate!: number;
  goalDate!: Date;
  minDate = new Date();
  enroll!: LearningTrailEnrollment | undefined;
  enrolled!: boolean;
  canOpenBatchEnrollment = false;
  hasSuperAdminPermission: boolean;
  hasAdminPermission: boolean;

  readonly defaultUserAvatar = environment.defaultUserAvatar;
  private learningTrailId!: string | undefined;

  get userId(): string {
    return this._authService.userId;
  }

  constructor(
    @Inject(DOCUMENT) protected override _document: Document,
    protected override _renderer2: Renderer2,
    protected override dialogRef: MatDialogRef<LearningTrailDetailComponent>,
    private _authService: AuthService,
    private _userProfileService: UserProfileService,
    private store: Store,
    private _pulseService: PulseService,
    private _router: Router,
    private _dialog: MatDialog,
    private _breakpointObserver: BreakpointObserver,
  ) {
    super(_document, _renderer2, dialogRef);
    this.learningTrail$ = this.store.select(fromSelectors.selectLearningTrail).pipe(
      filter((learningTrail) => !!learningTrail),
      tap((learningTrail) => {
        this.learningTrailId = learningTrail?.id;
        this.learningTrailDurationTime = learningTrail?.steps?.reduce((previous: number, current: Step): number => {
          const data = current.mission || current.pulse;
          const durationTime = data?.duration_time || 0;
          return previous + durationTime;
        }, 0);

        if (learningTrail) {
          this.expirationDate =
            (new Date(learningTrail.expiration_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
        }
      }),
    );

    this.titleInfo$ = this.learningTrail$.pipe(map(TrailDetailHelper.buildTitle));

    this.canOpenBatchEnrollment = this._userProfileService.hasRoles(['admin', 'super_admin', 'content']);

    this.learningTrailSteps$ = this.store.select(fromSelectors.selectLearningTrailSteps);

    this.enroll$ = this.store
      .select(fromSelectors.selectEnrollment)
      .pipe(tap((enrollment) => (this.enroll = enrollment)));

    this.enrolled$ = this.store
      .select(fromSelectors.selectEnrolled)
      .pipe(tap((enrolled) => (this.enrolled = enrolled)));
    this.canGiveUp$ = this.store.select(fromSelectors.selectCanGiveUp);
    this.canRetake$ = this.store.select(fromSelectors.selectCanRetake);
    this.enrollButtonDisabled$ = this.store.select(fromSelectors.selectEnrollButtonDisabled);
    this.canGenerateCertificate$ = this.store.select(fromSelectors.selectCanGenerateCertificate);
    this.learningTrailTags$ = this.store.select(fromSelectors.selectLearningTrailTags);
    this.hasSuperAdminPermission = this._userProfileService.isSuperAdmin();
    this.hasAdminPermission = this._userProfileService.isAdmin();
    this.lastContentItem = toSignal(store.select(fromSelectors.selectLastContentItem));

    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));

    this.resumeItems$ = combineLatest([this.learningTrail$, this.isMobile$]).pipe(
      map(([trail, isMobile]) => TrailDetailHelper.buildResume(trail, isMobile)),
    );

    this.canEditDescription$ = combineLatest([this.learningTrail$, this.isMobile$]).pipe(
      map(([trail, isMobile]) => !isMobile && (trail?.is_owner || this.hasSuperAdminPermission)),
    );
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(fromActions.loadLearningTrailReset());
  }

  edit(): void {
    this.dialogRef.close();
    this._router.navigate(['/learning-trails/create', this.learningTrailId]);
  }

  deleteTrail(): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = marker('LEARNING_TRAIL.DETAIL.REMOVE_TRAIL_TITLE');
    dialogRef.componentInstance.confirmMessage = marker('LEARNING_TRAIL.DETAIL.REMOVE_TRAIL_MESSAGE');
    dialogRef.componentInstance.positiveButtonLabel = marker('GENERAL.DELETE');

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.store.dispatch(fromActions.deleteLearningTrail({ id: this.learningTrailId || '' }))),
      )
      .subscribe();
  }

  onSelectStep({ type, step }: { type: string; step: Step }): void {
    if (type === 'mission') {
      this.navigateToMission(step.mission);
      return;
    }
    this.pulseStepSelected(step);
  }

  onGoalChange(): void {
    if (this.enroll?.give_up) {
      this.retake(this.goalDate.toISOString());
      return;
    }
    this.createEnrollment(this.goalDate.toISOString());
  }

  onGoalChangeMobile(date: Date): void {
    this.goalDate = date;
    this.onGoalChange();
  }

  certificate(): void {
    this.store.dispatch(
      fromActions.enrollGetCertificateLearningTrail({
        learning_trail_id: this.learningTrailId || '',
        user_id: this.userId || '',
      }),
    );
  }

  openBatchEnrollmentDialog(): void {
    this.store.dispatch(
      BatchEnrollmentsActions.openDialog({
        learningContentId: this.learningTrailId,
        enrollmentType: 'learning-trail',
      }),
    );
  }

  giveUp(): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: 600 });
    dialogRef.componentInstance.confirmTitle = 'LEARNING_TRAIL.DETAIL.GIVE_UP_CONFIRMATION.TITLE';
    dialogRef.componentInstance.confirmMessage = 'LEARNING_TRAIL.DETAIL.GIVE_UP_CONFIRMATION.MESSAGE';
    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.store.dispatch(fromActions.enrollGiveUpLearningTrail({ enrollment_id: this.enroll?.id ?? '' }))),
      )
      .subscribe();
  }

  transferTrail(trail: LearningTrail) {
    this.store.dispatch(
      TransferDialogActions.openDialog({
        dialogData: {
          contentType: TransferContentType.LEARNING_TRAIL,
          transferContent: { id: trail.id, name: trail.name },
        },
      }),
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  executeStepAction({ action, id }: StepCertificate): void {
    const runAction: Partial<Record<MissionActionId, () => void>> = {
      ['upload-certificate']: () => this.store.dispatch(fromActions.openAttachStepCertificate({ id })),
      ['generate-certificate']: () => this.store.dispatch(fromActions.generateStepCertificate({ id })),
    };
    runAction[action]();
  }

  openMissionDetail(mission: Mission): void {
    this.dialogRef.close({ mission, openDetail: true });
  }

  vinculateGroup(contentId: string): void {
    this.store.dispatch(VinculateToGroupActions.openDialog({ vinculateType: 'learning-trail', contentId }));
  }

  updateDescription(description: string): void {
    this.store.dispatch(fromActions.updateLearningTrailDescription({ id: this.learningTrailId, description }));
  }

  private pulseStepSelected(step: Step): void {
    this.navigateToPulse(step.pulse.id);
  }

  private navigateToPulse(pulseId: string): void {
    this.dialogRef.close({ pulseId, trailId: this.learningTrailId });
  }

  private navigateToMission(mission: Mission): void {
    if (mission.mission_model === MissionModel.EXTERNAL_PROVIDER) {
      KeepsUtils.openUrlInNewTab(mission.external_course_url);
      return;
    }

    this.dialogRef.close({ mission, trailId: this.learningTrailId });
  }

  private retake(goal_date: any): void {
    this.store.dispatch(
      fromActions.enrollRetakeLearningTrail({
        enrollment_id: this.enroll?.id || '',
        goal_date,
      }),
    );
  }

  private createEnrollment(goalDate: any) {
    this.store.dispatch(
      fromActions.enrollLearningTrail({
        learningTrailId: this.learningTrailId || '',
        userId: this.userId || '',
        goalDate,
      }),
    );
  }
}
