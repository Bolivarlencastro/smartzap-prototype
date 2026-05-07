import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export type Enrollment = {
  learn_content_name: string;
  id: string;
  progress: number;
  performance: number;
  status: EnrollmentStatuses;
  goal_date: string;
  required: boolean;
  normative: boolean;
  learn_content_type: 'course' | 'trail';
};
