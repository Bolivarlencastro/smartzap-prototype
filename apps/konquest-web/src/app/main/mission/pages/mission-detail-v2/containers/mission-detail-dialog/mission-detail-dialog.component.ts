import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { gamificationFeature } from '@app/shared/store';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpResume, KpResumeComponent } from '@keeps-platform-frontend-workspace/ui/kp-resume';
import { KpTitle, KpTitleComponent } from '@keeps-platform-frontend-workspace/ui/kp-title';
import { LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { Store } from '@ngrx/store';
import { Mission, MissionTag } from 'app/main/mission/mission.model';
import { MissionDetailHelper } from 'app/main/mission/pages/mission-detail-v2/containers/mission-detail-dialog/mission-detail-helper';
import { environment } from 'environments/environment';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MissionAction } from '../../builders/models/mission-action';
import { MissionDetailActions, MissionDetailSelectors, MissionOptionsMenuActions } from '../../store';
import { MissionDetailHeaderComponent } from '../../components/mission-detail-header/mission-detail-header.component';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { AsyncPipe, NgClass } from '@angular/common';
import { KpActionMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-actions-menu';
import { KpDescriptionComponent } from 'app/shared/components';
import { MissionDetailTagsComponent } from '../../components/mission-detail-tags/mission-detail-tags.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-mission-detail-dialog',
  templateUrl: './mission-detail-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MissionDetailHeaderComponent,
    MatDialogTitle,
    NgClass,
    KpResumeComponent,
    MatDialogContent,
    KpTitleComponent,
    KpActionMenuComponent,
    KpDescriptionComponent,
    MissionDetailTagsComponent,
    AsyncPipe,
  ],
})
export class MissionDetailDialogComponent {
  isMobile$: Observable<boolean>;
  resumeItems$: Observable<KpResume[]>;
  actionInProgress$: Observable<boolean>;
  canEditDescription$: Observable<boolean>;
  isLoading: Signal<boolean>;

  protected readonly mission$: Observable<Mission>;
  protected readonly canEditTags$: Observable<boolean>;
  protected readonly missionProgress$: Observable<number | undefined>;
  protected readonly titleInfo$: Observable<KpTitle>;
  protected readonly missionActions$: Observable<MissionAction[]>;
  protected readonly isGamificationActive$: Observable<boolean>;
  protected readonly missionTags$: Observable<LearnContentCardTag[]>;
  protected readonly gamificationSettings = environment.featureFlags['gamification'];

  constructor(
    private store: Store,
    private _breakpointObserver: BreakpointObserver,
  ) {
    this.mission$ = this.store.select(MissionDetailSelectors.selectMission);
    this.titleInfo$ = this.mission$.pipe(map(MissionDetailHelper.buildTitle));
    this.canEditTags$ = this.store.select(MissionDetailSelectors.selectCanEditTags);
    this.missionProgress$ = this.store.select(MissionDetailSelectors.selectMissionProgress);
    this.missionActions$ = this.store.select(MissionDetailSelectors.selectMissionActions);
    this.missionTags$ = this.store.select(MissionDetailSelectors.selectMissionTags);
    this.isLoading = toSignal(this.store.select(MissionDetailSelectors.selectLoading));

    this.actionInProgress$ = this.store.select(MissionDetailSelectors.selectActionInProgress);

    this.isMobile$ = this._breakpointObserver.observe([`(max-width: ${constants.defaultMobileWidth})`]).pipe(
      map((result) => result.matches),
      tap((isMobile) => this.initializeResume(isMobile)),
    );

    this.canEditDescription$ = combineLatest([this.mission$, this.isMobile$]).pipe(
      map(([mission, isMobile]) => !isMobile && mission?.development_status !== 'PROCESSING' && mission?.is_owner),
    );

    if (this.gamificationSettings) {
      this.isGamificationActive$ = this.store.select(gamificationFeature.selectIsGamificationActive);
    }
  }

  closeDialog() {
    this.store.dispatch(MissionDetailActions.closeMissionDetails());
  }

  updateMissionSummary(summary: string) {
    this.store.dispatch(MissionDetailActions.updateMissionSummary({ summary }));
  }

  onAddTag(tags: string | string[]) {
    this.store.dispatch(MissionDetailActions.createTags({ tags }));
  }

  onRemoveTag(tag: MissionTag) {
    this.store.dispatch(MissionDetailActions.removeTag({ tagId: tag.id }));
  }

  executeAction(action: MissionAction) {
    this.store.dispatch(MissionOptionsMenuActions.executeAction({ action }));
  }

  private initializeResume(isMobile: boolean): void {
    if (this.gamificationSettings) {
      const combined$ = combineLatest([this.mission$, this.isGamificationActive$]);

      this.resumeItems$ = combined$.pipe(
        map(([mission, isGamificationActive]) =>
          MissionDetailHelper.buildResume(mission, isMobile, isGamificationActive),
        ),
      );

      return;
    }

    this.resumeItems$ = this.mission$.pipe(map((mission) => MissionDetailHelper.buildResume(mission, isMobile)));
  }
}
