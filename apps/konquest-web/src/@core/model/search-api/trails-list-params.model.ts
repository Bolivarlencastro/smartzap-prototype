import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface TrailsListParams {
  search?: string;
  language?: string[];
  enrolled?: boolean;
  is_active?: boolean;
  managed?: boolean;
  exclude_enrollment_status?: EnrollmentStatuses[];
}
