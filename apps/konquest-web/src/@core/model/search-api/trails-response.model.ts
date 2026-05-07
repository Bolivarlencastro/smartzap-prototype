import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export type TrailEnrollment = {
  id: string;
  status: EnrollmentStatuses;
  goal_date: string;
  progress: number;
  required: boolean;
};

export interface TrailsResponse {
  id: string;
  name: string;
  points: number;
  duration_time: number;
  is_active: boolean;
  language: string;
  thumb_image: string;
  holder_image: string;
  expiration_date: string;
  created_date: string;
  missions_count: number;
  pulses_count: number;

  trail_type: {
    id: string;
    name: string;
  };

  user_creator: {
    id: string;
    name: string;
    avatar?: string;
  };

  stats?: {
    user_is_owner: boolean;
    user_enrollment: TrailEnrollment;
    total_courses: number;
    total_pulses: number;
    enrollment: number;
  };
}
