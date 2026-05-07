import { LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { MissionModel } from 'app/main/mission/mission.model';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export const MISSION_STATUS_TAG_MAP: Record<DevelopmentStatus, LearnContentCardTag> = {
  [DevelopmentStatus.DONE]: { type: 'development-published' },
  [DevelopmentStatus.IN_PROGRESS]: { type: 'development-creating' },
  [DevelopmentStatus.PROCESSING]: { type: 'development-processing' },
  [DevelopmentStatus.IN_REVIEW]: { type: 'development-awaiting-review' },
  [DevelopmentStatus.INACTIVATED]: { type: 'development-inactive' },
  [DevelopmentStatus.CLOSED]: { type: 'development-finished-event' },
  [DevelopmentStatus.INACTIVATED_BY_INTEGRATION]: { type: 'development-inactive-by-integration' },
};

export const MISSION_MODEL_TAG_MAP: {
  [MissionModel.LIVE]: LearnContentCardTag;
  [MissionModel.PRESENTIAL]: LearnContentCardTag;
} = {
  [MissionModel.LIVE]: { type: 'model-live' },
  [MissionModel.PRESENTIAL]: { type: 'model-presential' },
};

export const ENROLLMENT_STATUS_TAG_MAP: Record<EnrollmentStatuses, LearnContentCardTag> = {
  [EnrollmentStatuses.ENROLLED]: { type: 'enrollment-enrolled' },
  [EnrollmentStatuses.STARTED]: { type: 'enrollment-started' },
  [EnrollmentStatuses.EXPIRED]: { type: 'enrollment-expired' },
  [EnrollmentStatuses.REQUEST_EXTENSION]: { type: 'enrollment-required-new-deadline' },
  [EnrollmentStatuses.COMPLETED]: { type: 'enrollment-finished' },
  [EnrollmentStatuses.PENDING_VALIDATION]: { type: 'enrollment-awaiting-certificate-approval' },
  [EnrollmentStatuses.REPROVED]: { type: 'enrollment-certificate-reproved' },
  [EnrollmentStatuses.ENROLLMENT_REPROVED]: { type: 'enrollment-refused' },
  [EnrollmentStatuses.REFUSED]: { type: 'enrollment-refused' },
  [EnrollmentStatuses.GIVE_UP]: { type: 'enrollment-give-up' },
  [EnrollmentStatuses.INACTIVATED]: { type: 'enrollment-inactive' },
};
