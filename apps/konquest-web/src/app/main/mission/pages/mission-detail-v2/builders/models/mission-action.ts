export type MissionActionId =
  | 'open-mission'
  | 'give-up'
  | 'retake-mission'
  | 'enroll-into-mission'
  | 'enroll-presential-live-mission'
  | 'enter-live-event-enrolled'
  | 'enter-live-event-not-enrolled'
  | 'upload-certificate'
  | 'generate-certificate'
  | 'certificate-history'
  | 'evaluate-mission'
  | 'finish-external-mission';

export interface MissionAction {
  id: MissionActionId;
  label?: string;
  disabled?: boolean;
  order?: number;
}
