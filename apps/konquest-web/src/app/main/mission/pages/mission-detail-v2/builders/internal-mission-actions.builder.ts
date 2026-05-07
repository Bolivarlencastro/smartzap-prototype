import { MissionActionsDefaultBuilder } from './mission-actions-default.builder';
import { MissionActionsSettings } from './models';
import { MissionAction, MissionActionId } from './models/mission-action';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export class InternalMissionActionsBuilder {
  private _actions: Map<MissionActionId, MissionAction>;
  private readonly _defaultBuilder = new MissionActionsDefaultBuilder();

  constructor(private _settings: MissionActionsSettings) {
    this._actions = new Map<MissionActionId, MissionAction>();

    const isOwnerOrContributor = this._settings.isOwner || this._settings.isContributor;
    if (isOwnerOrContributor) {
      return;
    }

    this.withDefaultUserActions();
  }

  private withDefaultUserActions() {
    const disableOptions = this._settings.missionDevelopmentStatus !== DevelopmentStatus.DONE;

    switch (this._settings.enrollmentStatus) {
      case EnrollmentStatuses.ENROLLED:
      case EnrollmentStatuses.STARTED:
        this.setEnrolledActions(disableOptions);
        break;
      case EnrollmentStatuses.GIVE_UP:
        this.setGivenUpActions(disableOptions);
        break;
      case EnrollmentStatuses.COMPLETED:
        this.setCompletedActions(disableOptions);
        break;
      default:
        this.setNotEnrolledActions(disableOptions);
    }
  }

  private setEnrolledActions(disabled: boolean) {
    this._defaultBuilder.withOpenMissionAction(disabled);
    this.setGiveUpAction(disabled);
    this._actions = this._defaultBuilder.build();
  }

  private setGivenUpActions(disabled: boolean) {
    this._actions = this._defaultBuilder.withRetakeMissionAction(disabled).build();
  }

  private setCompletedActions(disabled: boolean) {
    this._actions = this._defaultBuilder.withOpenMissionAction(disabled).build();
  }

  private setNotEnrolledActions(disabled: boolean) {
    this._actions = this._defaultBuilder.withEnrollToMissionAction(disabled).build();
  }

  private setGiveUpAction(disabled: boolean) {
    if (!this._settings.requiredMission) {
      this._defaultBuilder.withGiveUpAction(disabled);
    }
  }

  build() {
    return this._actions;
  }
}
