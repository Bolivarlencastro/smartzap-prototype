import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { MissionEnrollmentsAPI } from '@core/api/mission-enrollments.api';
import {
  AluraIntegrationsApi,
  AuthService,
  KeepsPathLocationStrategy,
  KeepsUtils,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentActionData, LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import {
  MISSIONS_DETAIL_PREFIX,
  navigateToEvent,
  navigateToMission,
  navigateToTrail,
  TRAILS_DETAIL_PREFIX,
} from './route-dialog.service';
import { Router } from '@angular/router';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { environment } from 'environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { LearnContentActions } from 'app/shared/store';
import { isEvent } from '../utils/event.utils';

@Injectable({
  providedIn: 'root',
})
export class LearnContentActionsService {
  static getDashboardAction(learnContentAction: LearnContentActionData) {
    const ACTIONS_MAP: Record<LearnContentCardActionId, any> = {
      'add-bookmark': LearnContentActions.addBookmark({ learnContentAction }),
      'remove-bookmark': LearnContentActions.removeBookmark({ learnContentAction }),
      'request-new-deadline': LearnContentActions.requestNewDeadline({ learnContentAction }),
      enroll: LearnContentActions.enroll({ learnContentAction }),
      share: LearnContentActions.share({ learnContentAction }),
      continue: LearnContentActions.redirectTo({ learnContentAction }),
      start: LearnContentActions.redirectTo({ learnContentAction }),
      details: LearnContentActions.showDetails({ learnContentAction }),
    };

    return ACTIONS_MAP[learnContentAction.action];
  }

  constructor(
    private missionEnrollmentsApi: MissionEnrollmentsAPI,
    private authService: AuthService,
    private router: Router,
    private missionService: MissionServiceV2,
    private location: KeepsPathLocationStrategy,
    private clipBoard: Clipboard,
    private messageService: KpMessageService,
    private _aluraIntegrationApi: AluraIntegrationsApi,
  ) {}

  openDetails({ learnContent, contentType }: LearnContentActionData) {
    const contentId = learnContent.contentId;
    const missionModel = learnContent.missionModel;

    if (contentType === 'mission') {
      this.navigateToMission(contentId, missionModel);
      return;
    }

    navigateToTrail(this.router, contentId).then();
  }

  redirectTo({ learnContent, contentType, action }: LearnContentActionData): void {
    const contentId = learnContent.contentId;

    if (contentType === 'trail') {
      this.navigateToTrail(contentId);
      return;
    }

    const externalCourseUrl = learnContent.externalCourseUrl;
    if (externalCourseUrl) {
      this.navigateToExternalMission(externalCourseUrl, { learnContent, contentType, action });
      return;
    }

    this.internalRedirect(contentId, action);
  }

  enrollToMission(learnContentId: string) {
    const userId = this.authService.userId;
    return this.missionService.enroll(learnContentId, userId);
  }

  requestNewDeadline(enrollmentId: string) {
    return this.missionEnrollmentsApi.requestExtendDeadline(enrollmentId).pipe(
      tap({
        next: () => this.messageService.success(marker('ENROLLMENTS.REQUEST_EXTEND_SUCCESS')),
      }),
    );
  }

  shareContent({ learnContent, contentType }: LearnContentActionData) {
    const contentId = learnContent.contentId;
    const url = contentType === 'mission' ? this.getMissionShareURL(contentId) : this.getTrailShareUrl(contentId);
    this.messageService.success(marker('GENERAL.COPIED_TO_CLIPBOARD'));
    this.clipBoard.copy(url);
  }

  addBookmark(contentId: string) {
    return this.missionService.bookmark(contentId).pipe(
      tap({
        next: () => this.messageService.success(marker('MISSION.BOOKMARK_ADDED')),
        error: () => this.messageService.error(marker('MISSION.THIS_ACTION_COULD_NOT_BE_PERFORMED')),
      }),
    );
  }

  removeBookmark(bookmarkId: string) {
    return this.missionService.removeBookmark(bookmarkId).pipe(
      tap({
        next: () => this.messageService.success(marker('MISSION.BOOKMARK_REMOVED')),
        error: () => this.messageService.error(marker(marker('MISSION.BOOKMARK_REMOVED_ERROR'))),
      }),
    );
  }

  private navigateToTrail(contentId: string) {
    this.router.navigate(['/learning-trails/create', contentId]).then();
    return;
  }

  private navigateToExternalMission(externalCourseUrl: string, { learnContent }: LearnContentActionData) {
    const contentId = learnContent.contentId;

    if (learnContent.isIntegration) {
      this.navigateToIntegrationCourse(contentId);
      return;
    }

    KeepsUtils.openUrlInNewTab(externalCourseUrl);
  }

  private internalRedirect(contentId: string, action: LearnContentCardActionId) {
    const redirectMap = new Map<LearnContentCardActionId, string[]>([
      ['continue', ['/course', contentId]],
      ['start', ['/course', contentId]],
      ['enroll', ['/course', contentId]],
    ]);
    this.router.navigate(redirectMap.get(action)).then();
  }

  private getMissionShareURL(missionId: string) {
    const workspaceHash = this.location.getHashFromUrl();
    return `${environment.apps.konquest.url}${workspaceHash}${MISSIONS_DETAIL_PREFIX}/${missionId}`;
  }

  private getTrailShareUrl(trailId: string) {
    const workspaceHash = this.location.getHashFromUrl();
    return `${environment.apps.konquest.url}${workspaceHash}${TRAILS_DETAIL_PREFIX}/${trailId}`;
  }

  private navigateToMission(contentId: string, missionModel: string): void {
    if (isEvent(missionModel)) {
      navigateToEvent(this.router, contentId).then();
      return;
    }

    navigateToMission(this.router, contentId).then();
  }

  private navigateToIntegrationCourse(missionId: string) {
    this._aluraIntegrationApi
      .getAccessUrlByMissionId(missionId)
      .pipe(take(1))
      .subscribe({
        next: ({ url }) => KeepsUtils.openUrlInNewTab(url),
        error: () => this.messageService.error(marker('MISSION.THIS_ACTION_COULD_NOT_BE_PERFORMED')),
      });
  }
}
