import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionModel } from 'app/main/mission/mission.model';

export type CourseEnrollment = {
  id: string;
  status: EnrollmentStatuses;
  goal_date: string;
  progress: number;
  required: boolean;
};

export interface CoursesResponse {
  id: string;
  name: string;
  description: string;

  points: number;
  duration_time: number;
  development_status: string;
  is_active: boolean;
  language: string;
  summary: string;
  course_model: MissionModel;
  thumb_image: string;
  holder_image: string;
  vertical_holder_image: string;

  created_date: string;
  updated_date: string;
  expiration_date: string;

  assessment_type: string;
  required_evaluation: boolean;
  allow_self_reproved_enrollment_renewal: boolean;
  allow_self_enrollment_renewal: boolean;

  course_type: {
    id: string;
    name: string;
  };

  course_category: {
    id: string;
    name: string;
  };

  user_creator: {
    id: string;
    name: string;
    avatar: string;
    email: string;
    status: boolean;
  };

  live_course?: {
    id: string;
    url: string;
    notify_users_enrolled: boolean;
    allow_any_enrollment: boolean;
  };

  presential_course?: {
    id: string;
    address: string;
    notify_users_enrolled: boolean;
    allow_any_enrollment: boolean;
  };

  external_course?: {
    id: string;
    course_url: string;
    course_type: string;
    provider_id: string;
    provider_name: string;
    provider_description: string;
    provider_icon: string;
  };

  tags: {
    id: string;
    name: string;
    relevance: number;
  }[];

  course_contents?: {
    stage_id: string;
    stage_name: string;
    stage_order: number;
    content_id: string;
    content_name: string;
    content_order: number;
    content_type_id: string;
    content_type_name: string;
    kontent_id: string;
  }[];

  contributors?: {
    relation_id: string;
    user_id: string;
    created_date: string;
    updated_date: string;
  }[];

  stats?: {
    user_enrollment: CourseEnrollment;
    user_is_contributor: boolean;
    user_is_owner: boolean;
    workspace_minimum_performance: number;
    favorite?: string;
    is_integration?: boolean;
    enrollments_count?: number;
    shared?: boolean;
  };

  event_date?: string;
}
