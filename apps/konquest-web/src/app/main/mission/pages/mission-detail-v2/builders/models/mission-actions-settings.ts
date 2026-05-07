import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MISSION_USER_TYPE } from './mission-user-type.enum';
import { MissionModel } from '@app/main/mission/mission.model';

export interface MissionActionsSettings {
  userType: MISSION_USER_TYPE;
  missionDevelopmentStatus: DevelopmentStatus;
  enrollmentStatus?: EnrollmentStatuses;
  requiredMission?: boolean;
  sharedMission?: boolean;
  requiredEvaluation?: boolean;
  attendedMission?: boolean;
  userHasEvaluated?: boolean;
  isOwner?: boolean;
  isContributor?: boolean;
  isInstructor?: boolean;
  isIntegrationMission?: boolean;
  mission_model?: MissionModel;
  liveInProgress?: boolean;
  vacancyLimitReached?: boolean;
}
