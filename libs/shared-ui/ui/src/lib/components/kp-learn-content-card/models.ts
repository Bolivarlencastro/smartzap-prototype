import { LearnContentCardActionId, LearnContentCardTag } from '../../models';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface LearnContentCardData {
  contentId: string;
  backgroundImage: string;
  title: string;
  enrollmentId?: string;
  progress?: number;
  language: string;
  duration?: number;
  externalProvider?: string;
  missionsCount?: number;
  pulsesCount?: number;
  externalCourseUrl?: string;
  actions?: LearnContentCardActionId[];
  tags?: LearnContentCardTag[];
  missionModel?: string;
  eventDate?: string;
  bookmarkId?: string;
  isIntegration?: boolean;
  isActive?: boolean;
  isOwner?: boolean;
  isContributor?: boolean;
  expirationDate?: string;
  enrollment?: { status: EnrollmentStatuses; goal_date?: string; required?: boolean };
  developmentStatus?: DevelopmentStatus;
  categoryLabel?: string;
}
