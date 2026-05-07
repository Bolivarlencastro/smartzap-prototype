import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface CoursesListParams {
  mission_category?: string[];
  language?: string[];
  is_active?: boolean;
  enrolled?: boolean;
  managed?: boolean;
  development_status?: string;
  favorites?: boolean;
  exclude_enrollment_status?: EnrollmentStatuses[];
  missionCategory?: string[];
  provider?: string[];
  mission_model?: string[];
  minimum_performance__gte?: string;
  minimum_performance__lte?: string;
}
