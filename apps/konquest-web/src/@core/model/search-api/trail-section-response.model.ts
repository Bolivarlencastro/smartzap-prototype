import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface TrailSectionResponse {
  id: string;
  duration: number;
  is_active: boolean;
  language: string;
  thumb_image: string;
  title: string;
  stats: {
    is_owner: boolean;
    missions_count: number;
    pulse_count: number;
    enrollment: {
      enrollment_id: string;
      goal_date: string;
      progress: number;
      required: boolean;
      status: EnrollmentStatuses;
    };
  };
}
