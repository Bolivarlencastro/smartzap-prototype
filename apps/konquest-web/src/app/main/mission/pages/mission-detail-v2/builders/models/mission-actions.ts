import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MissionAction } from './mission-action';

export const openMission: MissionAction = {
  id: 'open-mission',
  label: marker('MISSION.DETAILS.ACTIONS.OPEN_MISSION'),
};

export const giveUpOnMission: MissionAction = {
  id: 'give-up',
  label: marker('MISSION.DETAILS.ACTIONS.GIVE_UP'),
};

export const retakeMission: MissionAction = {
  id: 'retake-mission',
  label: marker('MISSION.DETAILS.ACTIONS.RETAKE'),
};

export const enrollToMission: MissionAction = {
  id: 'enroll-into-mission',
  label: marker('MISSION.DETAILS.ACTIONS.ENROLL'),
};

export const enrollToPresentialLiveMission: MissionAction = {
  id: 'enroll-presential-live-mission',
  label: marker('MISSION.DETAILS.ACTIONS.ENROLL'),
};

export const enterToLiveEventEnrolled: MissionAction = {
  id: 'enter-live-event-enrolled',
  label: marker('MISSION.DETAILS.ACTIONS.ENTER_TO_LIVE_EVENT'),
};

export const enterToLiveEventNotEnrolled: MissionAction = {
  id: 'enter-live-event-not-enrolled',
  label: marker('MISSION.DETAILS.ACTIONS.ENTER_TO_LIVE_EVENT'),
};

export const uploadCertificate: MissionAction = {
  id: 'upload-certificate',
  label: marker('MISSION.DETAILS.ACTIONS.UPLOAD_CERTIFICATE'),
};

export const generateCertificate: MissionAction = {
  id: 'generate-certificate',
  label: marker('MISSION.DETAILS.ACTIONS.GENERATE_CERTIFICATE'),
};

export const certificateHistory: MissionAction = {
  id: 'certificate-history',
  label: marker('MISSION.DETAILS.ACTIONS.CERTIFICATE_HISTORY'),
};

export const evaluateMission: MissionAction = {
  id: 'evaluate-mission',
  label: marker('MISSION.DETAILS.ACTIONS.EVALUATE_MISSION'),
};

export const finishExternalMission: MissionAction = {
  id: 'finish-external-mission',
  label: marker('MISSION.DETAILS.ACTIONS.FINISH'),
};
