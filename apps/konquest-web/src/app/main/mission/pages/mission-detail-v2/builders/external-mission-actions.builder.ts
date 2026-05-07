import { MissionActionsDefaultBuilder } from './mission-actions-default.builder';
import { MissionActionsSettings } from './models';
import { MissionAction, MissionActionId } from './models/mission-action';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export class ExternalMissionActionsBuilder {
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
      case EnrollmentStatuses.REFUSED:
        this.setRefusedEnrollmentActions(disableOptions);
        break;
      case EnrollmentStatuses.REPROVED:
        this.setReprovedEnrollmentActions(disableOptions);
        break;
      case EnrollmentStatuses.ENROLLED:
      case EnrollmentStatuses.STARTED:
        this.setEnrolledActions(disableOptions);
        break;
      case EnrollmentStatuses.PENDING_VALIDATION:
        this.setPendingValidationActions(disableOptions);
        break;
      case EnrollmentStatuses.GIVE_UP:
        this.setGivenUpActions(disableOptions);
        break;
      case EnrollmentStatuses.COMPLETED:
        this.setCompletedEnrollmentActions(disableOptions);
        break;
      default:
        this.setNotEnrolledActions(disableOptions);
    }
  }

  private setRefusedEnrollmentActions(disabled: boolean) {
    if (!this._settings.isIntegrationMission) {
      this._defaultBuilder.withUploadCertificateAction(disabled).withOpenCertificateHistoryAction(disabled);
    }

    this._defaultBuilder.withOpenMissionAction(disabled).withGiveUpAction(disabled);
    this._actions = this._defaultBuilder.build();
  }

  private setReprovedEnrollmentActions(disabled: boolean) {
    this._actions = this._defaultBuilder.withOpenMissionAction(disabled).withGiveUpAction(disabled).build();
  }

  private setCompletedEnrollmentActions(disabled: boolean) {
    this._actions = this._defaultBuilder.withOpenMissionAction(disabled).build();
  }

  private setEnrolledActions(disabled: boolean) {
    if (!this._settings.isIntegrationMission) {
      this._defaultBuilder.withFinishExternalMissionAction(disabled);
    }
    this._defaultBuilder.withOpenMissionAction(disabled);
    this.setGiveUpAction(disabled);
    this._actions = this._defaultBuilder.build();
  }

  private setPendingValidationActions(disabled: boolean) {
    this._defaultBuilder.withOpenMissionAction(disabled);
    this.setGiveUpAction(disabled);
    this._actions = this._defaultBuilder.build();
  }

  private setGivenUpActions(disabled: boolean) {
    this._actions = this._defaultBuilder.withRetakeMissionAction(disabled).build();
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
