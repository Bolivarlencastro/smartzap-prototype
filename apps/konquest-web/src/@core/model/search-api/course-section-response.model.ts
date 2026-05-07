import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface CourseSectionResponse {
  id: string;
  course_model: string;
  development_status: DevelopmentStatus;
  duration: number;
  event_date: string;
  external_url: string;
  language: string;
  thumb_image: string;
  title: string;
  vertical_holder_image: string;
  external_course: {
    course_type: string;
    course_url: string;
    id: string;
    provider_description: string;
    provider_icon: string;
    provider_id: string;
    provider_name: string;
  };
  stats: {
    favorite: string;
    is_contributor: boolean;
    is_instructor: boolean;
    is_integration: boolean;
    is_owner: boolean;
    enrollment: {
      enrollment_id: string;
      goal_date: string;
      progress: number;
      required: boolean;
      status: EnrollmentStatuses;
    };
  };
}
