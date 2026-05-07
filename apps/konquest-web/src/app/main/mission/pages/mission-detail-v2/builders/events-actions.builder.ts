import { MissionModel } from '@app/main/mission/mission.model';
import { MissionActionsDefaultBuilder } from './mission-actions-default.builder';
import { MissionActionsSettings } from './models';
import { MissionAction, MissionActionId } from './models/mission-action';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export class EventsActionsBuilder {
  private _actions: Map<MissionActionId, MissionAction>;
  private readonly _defaultBuilder = new MissionActionsDefaultBuilder();

  constructor(private readonly _settings: MissionActionsSettings) {
    this._actions = new Map<MissionActionId, MissionAction>();
    this.withUserActions();
  }

  private withUserActions() {
    const isOwnerOrContributor = this._settings.isOwner || this._settings.isContributor || this._settings.isInstructor;
    if (isOwnerOrContributor) {
      return;
    }

    this.withDefaultUserActions();
  }

  private withDefaultUserActions(): void {
    if (this._settings.missionDevelopmentStatus === DevelopmentStatus.CLOSED) {
      this.setFinishedMissionUserActions();
      return;
    }

    if (this._settings.mission_model === MissionModel.LIVE) {
      this.setNotFinishedMissionUserActionsLive();
      return;
    }

    this.setNotFinishedMissionUserActionsPresential();
  }

  private setNotFinishedMissionUserActionsLive() {
    const isEnrolled = [EnrollmentStatuses.STARTED, EnrollmentStatuses.ENROLLED].includes(
      this._settings.enrollmentStatus,
    );
    const eventInProgress = this._settings.liveInProgress;

    if (isEnrolled) {
      this._defaultBuilder.withEnterToLiveEventEnrolledAction(!eventInProgress);
      this._defaultBuilder.withGiveUpAction();
    } else if (eventInProgress) {
      this._defaultBuilder.withEnterToLiveEventNotEnrolledAction(this._settings.vacancyLimitReached);
    } else {
      this.setEnrollToMissionAction(this._settings.vacancyLimitReached);
    }

    this._actions = this._defaultBuilder.build();
  }

  private setNotFinishedMissionUserActionsPresential() {
    switch (this._settings.enrollmentStatus) {
      case EnrollmentStatuses.STARTED:
      case EnrollmentStatuses.ENROLLED:
        this._defaultBuilder.withGiveUpAction();
        break;
      default:
        this.setEnrollToMissionAction(this._settings.vacancyLimitReached);
    }

    this._actions = this._defaultBuilder.build();
  }

  private setFinishedMissionUserActions() {
    if (!this._settings.attendedMission) {
      return;
    }

    if (this._settings.requiredEvaluation) {
      this.setRequiredEvaluationActions();
    } else {
      this._defaultBuilder.withGenerateCertificateAction();
    }

    this._actions = this._defaultBuilder.build();
  }

  private setEnrollToMissionAction(disabled: boolean) {
    this._defaultBuilder.withEnrollToPresentialLiveMissionAction(disabled);
  }

  private setRequiredEvaluationActions() {
    if (!this._settings.userHasEvaluated) {
      this._defaultBuilder.withEvaluateMissionAction();
      return;
    }

    this._defaultBuilder.withGenerateCertificateAction();
  }

  build() {
    return this._actions;
  }
}
