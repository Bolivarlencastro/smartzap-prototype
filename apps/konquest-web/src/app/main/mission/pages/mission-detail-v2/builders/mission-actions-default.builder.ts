import { MissionActions } from './models';
import { MissionAction, MissionActionId } from './models/mission-action';

export class MissionActionsDefaultBuilder {
  private readonly _actions: Map<MissionActionId, MissionAction>;

  constructor() {
    this._actions = new Map<MissionActionId, MissionAction>();
  }

  build() {
    return this._actions;
  }

  withOpenMissionAction(disabled?: boolean) {
    this._actions.set(MissionActions.openMission.id, { ...MissionActions.openMission, disabled });
    return this;
  }

  withEnrollToMissionAction(disabled?: boolean) {
    this._actions.set(MissionActions.enrollToMission.id, { ...MissionActions.enrollToMission, disabled });
    return this;
  }

  withEnrollToPresentialLiveMissionAction(disabled?: boolean) {
    this._actions.set(MissionActions.enrollToPresentialLiveMission.id, {
      ...MissionActions.enrollToPresentialLiveMission,
      disabled,
    });
    return this;
  }

  withEnterToLiveEventEnrolledAction(disabled?: boolean) {
    this._actions.set(MissionActions.enterToLiveEventEnrolled.id, {
      ...MissionActions.enterToLiveEventEnrolled,
      disabled,
    });
    return this;
  }

  withEnterToLiveEventNotEnrolledAction(disabled?: boolean) {
    this._actions.set(MissionActions.enterToLiveEventNotEnrolled.id, {
      ...MissionActions.enterToLiveEventNotEnrolled,
      disabled,
    });
    return this;
  }

  withEvaluateMissionAction(disabled?: boolean) {
    this._actions.set(MissionActions.evaluateMission.id, { ...MissionActions.evaluateMission, disabled });
    return this;
  }

  withFinishExternalMissionAction(disabled?: boolean) {
    this._actions.set(MissionActions.finishExternalMission.id, { ...MissionActions.finishExternalMission, disabled });
    return this;
  }

  withGenerateCertificateAction(disabled?: boolean) {
    this._actions.set(MissionActions.generateCertificate.id, { ...MissionActions.generateCertificate, disabled });
    return this;
  }

  withGiveUpAction(disabled?: boolean) {
    this._actions.set(MissionActions.giveUpOnMission.id, { ...MissionActions.giveUpOnMission, disabled });
    return this;
  }

  withOpenCertificateHistoryAction(disabled?: boolean) {
    this._actions.set(MissionActions.certificateHistory.id, { ...MissionActions.certificateHistory, disabled });
    return this;
  }

  withRetakeMissionAction(disabled?: boolean) {
    this._actions.set(MissionActions.retakeMission.id, { ...MissionActions.retakeMission, disabled });
    return this;
  }

  withUploadCertificateAction(disabled?: boolean) {
    this._actions.set(MissionActions.uploadCertificate.id, { ...MissionActions.uploadCertificate, disabled });
    return this;
  }
}
