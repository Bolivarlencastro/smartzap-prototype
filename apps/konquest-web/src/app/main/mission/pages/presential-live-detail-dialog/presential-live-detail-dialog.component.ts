import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Enrollment } from '@core/model/enrollment.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { SupportMaterial, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpActionMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-actions-menu';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { Store } from '@ngrx/store';
import { MissionTransferDialogData, MissionTransferType } from 'app/main/mission-transfer/models';
import { MissionTransferActions } from 'app/main/mission-transfer/store';
import { MissionAction } from 'app/main/mission/pages/mission-detail-v2/builders';
import { KpDescriptionComponent } from 'app/shared/components';
import { KpCardStatus } from 'app/shared/models';
import { environment } from 'environments/environment';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { Mission, MissionInformationDate, MissionInstructor, MissionModel } from '../../mission.model';
import { MissionServiceV2 } from '../../services/mission.service';
import {
  MissionDetailActions,
  MissionDetailSelectors,
  MissionOptionsMenuActions,
  PresentialLiveSelectors,
} from '../mission-detail-v2/store';
import { EventDatesComponent } from './components/event-dates/event-dates.component';

@Component({
  selector: 'app-presential-live-mission-detail-dialog',
  templateUrl: './presential-live-detail-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    KpActionMenuComponent,
    KpDescriptionComponent,
    MatButton,
    MatDivider,
    AsyncPipe,
    UpperCasePipe,
    DatePipe,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
    KpCardTagComponent,
    UpperCasePipe,
    KpDurationPipe,
    MatMenuModule,
    KpContentIconName,
    MatTooltipModule,
    EventDatesComponent,
  ],
})
export class PresentialLiveDetailDialogComponent implements OnInit, OnDestroy {
  locationUrl = 'https://www.google.com/maps/place/';
  isAdmin = this._userProfileService.isAdmin();
  isSuperAdmin = this._userProfileService.isSuperAdmin();

  eventDates: Signal<MissionInformationDate[]>;
  statuses: KpCardStatus[] = [];
  enrollment?: Enrollment;
  enrollment$: Observable<Enrollment | undefined>;
  mission$: Observable<Mission>;
  mainAction: MissionAction;
  isMobile$: Observable<boolean>;
  isLoading: Signal<boolean>;
  usersEnrolled: string | number;

  readonly defaultAvatar = environment.defaultUserAvatar;
  private _unsubscribeAll = new Subject();
  protected mission: Mission;
  protected readonly missionActions$: Observable<MissionAction[]>;
  protected readonly supportMaterials: Signal<SupportMaterial[]>;
  private readonly defaultBg = 'https://assets.keepsdev.com/images/placeholders/default-card-bg.png';

  get backgroundImage(): string {
    return `url(${this.mission?.holder_image || this.defaultBg})`;
  }

  get missionModelTag(): string {
    return this.mission?.mission_model === MissionModel.LIVE ? 'model-live' : 'model-presential';
  }

  get instructors(): string[] | MissionInstructor[] {
    return this.mission?.live?.instructors ?? this.mission?.presential?.instructors;
  }

  get disableActions(): boolean {
    return this.isAdmin || this.isSuperAdmin || this.mission?.is_owner || this.mission?.is_contributor;
  }

  constructor(
    public dialogRef: MatDialogRef<PresentialLiveDetailDialogComponent>,
    private store: Store,
    private _missionService: MissionServiceV2,
    private _userProfileService: UserProfileService,
    private _breakpointObserver: BreakpointObserver,
  ) {
    this.eventDates = toSignal(this.store.select(PresentialLiveSelectors.selectMissionDates));

    this.mission$ = this.store.select(MissionDetailSelectors.selectMission).pipe(
      tap((mission) => {
        this.mission = mission;
        this.buildUsersEnrolledParam();
      }),
    );

    this.enrollment$ = this.store
      .select(PresentialLiveSelectors.selectMissionEnrollment)
      .pipe(tap((enrollment) => (this.enrollment = enrollment)));

    combineLatest([this.enrollment$, this.mission$])
      .pipe(distinctUntilChanged(), takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.statuses = this._missionService.buildStatuses(this.mission, this.enrollment);
      });

    if (this.mission?.mission_model === MissionModel.PRESENTIAL && this.mission.presential) {
      this.locationUrl += encodeURI(this.mission.presential?.address);
    }

    this.missionActions$ = this.store
      .select(MissionDetailSelectors.selectMissionActions)
      .pipe(tap((actions) => this.buildMainAction(actions)));

    this.supportMaterials = toSignal(this.store.select(MissionDetailSelectors.selectSupportMaterials));
    this.isLoading = toSignal(this.store.select(MissionDetailSelectors.selectLoading));
  }

  ngOnInit(): void {
    this.isMobile$ = this._breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  executeAction(action: MissionAction) {
    this.store.dispatch(MissionOptionsMenuActions.executeAction({ action }));
  }

  openTransferDialog(transferType: MissionTransferType) {
    const data: MissionTransferDialogData = {
      mission: this.mission,
      transferType,
    };
    this.store.dispatch(MissionTransferActions.openDialog({ data }));
  }

  mainActionClick(): void {
    this.executeAction(this.mainAction);
  }

  updateDescription(description: string) {
    this.store.dispatch(MissionDetailActions.updateLiveMissionSummary({ description }));
  }

  onOpenSupportMaterial(url: string) {
    window.open(url, 'blank');
  }

  private buildMainAction(actions: MissionAction[]): void {
    this.mainAction = [...actions].shift();
  }

  private buildUsersEnrolledParam() {
    const missionModel = this.mission?.mission_model.toLowerCase();
    const seats = this.mission?.[missionModel]?.seats;
    const usersEnrolled = this.mission?.users_enrolled;

    if (seats) {
      this.usersEnrolled = `${usersEnrolled} / ${seats}`;
      return;
    }

    this.usersEnrolled = usersEnrolled;
  }
}
