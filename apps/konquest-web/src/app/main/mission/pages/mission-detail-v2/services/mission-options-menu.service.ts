import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import {
  AluraIntegrationsApi,
  AuthService,
  KeepsUtils,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpInputDataDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-input-data-dialog';
import { KpLogDialogComponent, KpLogDialogData } from '@keeps-platform-frontend-workspace/ui/kp-log-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import {
  Mission,
  MissionInstructor,
  MissionLive,
  MissionModel,
  MissionModelInformation,
} from 'app/main/mission/mission.model';
import {
  EventsActionsBuilder,
  ExternalMissionActionsBuilder,
  InternalMissionActionsBuilder,
  MISSION_USER_TYPE,
  MissionAction,
  MissionActionId,
  MissionActionsSettings,
} from 'app/main/mission/pages/mission-detail-v2/builders';
import { MissionOptionsMenuActions } from 'app/main/mission/pages/mission-detail-v2/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MissionOptionsMenuService {
  static getAction(missionActionId: MissionActionId): any {
    const actionsMap: Record<MissionActionId, any> = {
      'open-mission': MissionOptionsMenuActions.redirectTo({ redirectType: missionActionId }),
      'give-up': MissionOptionsMenuActions.giveUp(),
      'retake-mission': MissionOptionsMenuActions.retakeMission(),
      'enroll-into-mission': MissionOptionsMenuActions.enrollToMission(),
      'upload-certificate': MissionOptionsMenuActions.openAttachCertificate(),
      'generate-certificate': MissionOptionsMenuActions.generatePresentialLiveCertificate({}),
      'certificate-history': MissionOptionsMenuActions.certificateHistory(),
      'enroll-presential-live-mission': MissionOptionsMenuActions.enrollToPresentialLiveMission(),
      'evaluate-mission': MissionOptionsMenuActions.openEvaluationDialog(),
      'finish-external-mission': MissionOptionsMenuActions.finishExternalMission(),
      'enter-live-event-enrolled': MissionOptionsMenuActions.enterToLiveEventEnrolled(),
      'enter-live-event-not-enrolled': MissionOptionsMenuActions.enterToLiveEventNotEnrolled(),
    };

    return actionsMap[missionActionId];
  }

  constructor(
    private _workspaceService: WorkspaceService,
    private _dialog: MatDialog,
    private _router: Router,
    private _messageService: KpMessageService,
    private _authService: AuthService,
    private _aluraIntegrationApi: AluraIntegrationsApi,
  ) {}

  buildMissionActions(mission: Mission, isAdmin: boolean, isSuperAdmin: boolean): MissionAction[] {
    const userType = this.getMissionActionsUserType(isAdmin, isSuperAdmin);
    const settings = this.getMissionActionsSettings(mission, userType, this._workspaceService.currentWorkspaceId);
    const builder = this.getActionsBuilder(mission.mission_model, settings);
    return this.orderActions(Array.from(builder.build().values()));
  }

  openGiveUpDialog(): Observable<string | undefined> {
    return this._dialog
      .open(KpInputDataDialogComponent, {
        data: {
          confirmTitle: 'MISSION.GIVE_UP.CONFIRM_TITLE',
          placeholder: 'MISSION.GIVE_UP.CONFIRM_PLACEHOLDER',
        },
        minWidth: '35vw',
      })
      .afterClosed();
  }

  redirectTo(actionId: MissionActionId, mission: Mission): void {
    const missionModel = mission.mission_model;
    const missionId = mission.id;

    if (actionId === 'open-mission' && missionModel === MissionModel.EXTERNAL_PROVIDER) {
      this.openExternalMission(mission);
      return;
    }

    const redirectMap = new Map<MissionActionId, string[]>([['open-mission', ['/course', missionId]]]);

    this._router.navigate(redirectMap.get(actionId));
  }

  openCertificateHistory(mission: Mission) {
    const data: KpLogDialogData = { title: 'CERTIFICATE.HISTORY_TITLE', log: mission.enrollment?.approve_msg };
    this._dialog.open(KpLogDialogComponent, { width: '600px', data });
  }

  private openExternalMission(mission: Mission) {
    if (mission.is_integration) {
      this.navigateToIntegrationCourse(mission.id);
      return;
    }

    KeepsUtils.openUrlInNewTab(mission.external_course_url);
  }

  private getMissionActionsUserType(isAdmin: boolean, isSuperAdmin: boolean): MISSION_USER_TYPE {
    if (isSuperAdmin) {
      return MISSION_USER_TYPE.SUPER_ADMIN;
    }

    if (isAdmin) {
      return MISSION_USER_TYPE.ADMIN;
    }

    return MISSION_USER_TYPE.USER;
  }

  private getMissionActionsSettings(
    mission: Mission,
    userType: MISSION_USER_TYPE,
    currentWorkspaceId: string,
  ): MissionActionsSettings {
    const missionModel = mission?.mission_model?.toLowerCase();
    const seats = mission?.[missionModel]?.seats;
    const usersEnrolled = mission?.users_enrolled;
    const vacancyLimitReached = seats ? usersEnrolled >= seats : false;

    return {
      userType,
      missionDevelopmentStatus: mission?.development_status,
      enrollmentStatus: mission?.enrollment?.status,
      requiredMission: mission?.enrollment?.required,
      sharedMission: mission.workspace_source_id !== currentWorkspaceId,
      requiredEvaluation: mission?.required_evaluation,
      attendedMission: mission?.enrollment?.attended,
      userHasEvaluated: mission?.enrollment?.evaluated,
      isOwner: mission?.is_owner,
      isContributor: mission?.is_contributor,
      isInstructor: this.isMissionInstructor(mission, this._authService.userId),
      isIntegrationMission: mission?.is_integration,
      mission_model: mission?.mission_model,
      liveInProgress: this.isNowInLiveEventRange(mission?.live),
      vacancyLimitReached,
    };
  }

  private getActionsBuilder(
    missionModel: MissionModel,
    settings: MissionActionsSettings,
  ): InternalMissionActionsBuilder | ExternalMissionActionsBuilder | EventsActionsBuilder {
    const buildersMap = new Map<
      MissionModel,
      InternalMissionActionsBuilder | ExternalMissionActionsBuilder | EventsActionsBuilder
    >([
      [MissionModel.INTERNAL, new InternalMissionActionsBuilder(settings)],
      [MissionModel.SCORM, new InternalMissionActionsBuilder(settings)],
      [MissionModel.EXTERNAL_PROVIDER, new ExternalMissionActionsBuilder(settings)],
      [MissionModel.PRESENTIAL, new EventsActionsBuilder(settings)],
      [MissionModel.LIVE, new EventsActionsBuilder(settings)],
    ]);

    return buildersMap.get(missionModel);
  }

  private orderActions(missionActions: MissionAction[]): MissionAction[] {
    return [...(missionActions ?? [])].sort(
      (a, b) => (a.order ?? Number.MIN_SAFE_INTEGER) - (b.order ?? Number.MIN_SAFE_INTEGER),
    );
  }

  private isMissionInstructor(mission: Mission, userId: string): boolean {
    const missionModelInformation: MissionModelInformation =
      mission[mission?.mission_model?.toLowerCase() as keyof Mission];

    return missionModelInformation?.instructors?.some((instructor: MissionInstructor | string) => {
      if (typeof instructor !== 'string') {
        return instructor.id === userId;
      }

      return instructor === userId;
    });
  }

  private navigateToIntegrationCourse(missionId: string) {
    this._aluraIntegrationApi
      .getAccessUrlByMissionId(missionId)
      .pipe(take(1))
      .subscribe({
        next: ({ url }) => KeepsUtils.openUrlInNewTab(url),
        error: () => this._messageService.error(marker('MISSION.THIS_ACTION_COULD_NOT_BE_PERFORMED')),
      });
  }

  private isNowInLiveEventRange(live: MissionLive): boolean | null {
    if (!live) {
      return null;
    }

    const now = new Date();

    for (const date of live.dates) {
      const startAt = new Date(date.start_at);
      const endAt = new Date(date.end_at);

      if (now >= startAt && now <= endAt) {
        return true;
      }
    }

    return false;
  }
}
