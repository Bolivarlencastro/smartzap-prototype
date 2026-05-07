import { AnalyticsResponse, AnalyticsResponseBucket, AnalyticsResponseRange, BaseElasticData } from './analytics.model';

export type UserApiResponse = AnalyticsResponse<BaseElasticData<UserSource>>;

export type UserDataResponse = AnalyticsResponse<BaseElasticData<UserSource>, UserDataStats>;

export type UserListResponse = AnalyticsResponse<BaseElasticData<UserSource, UserListStats>>;

export type UserEnrollmentDistributionResponse = AnalyticsResponse<void, UserEnrollmentDistributionStats>;

export interface UserSource {
  id: string;
  name: string;
  nickname: string;
  email: string;

  gender: string;
  avatar: string;
  language_id: string;

  status: string;
  created_date: string;
  updated_date: string;
  leader_id?: string;
  leader_name?: string;

  user_role_workspace?: {
    id: string;
    workspace_id: string;
    status: string;
    role: {
      id: string;
      name: string;
    };
  }[];
}

export interface UserDataStats {
  enrollments: {
    total: number;
    performance_avg: number;
    categories: AnalyticsResponseBucket[];
    completed: {
      total: number;
      ratio: number;
      performance_avg: number;
      ranges: AnalyticsResponseRange[];
    };
  };

  activities: {
    total_seconds: number;
    enrollments_total_activities: number;
    enrollments_total_seconds: number;
    completed_enrollments_total_activities: number;
    completed_enrollments_total_seconds: number;

    courses_total_courses: number;
    courses_total_activities: number;

    pulses_total_activities: number;
    pulses_total_pulses: number;

    courses_recent_activities: {
      last_30_days: { doc_count: number; unique_courses: { value: number } };
      last_7_days: { doc_count: number; unique_courses: { value: number } };
      previous_30_days: { doc_count: number; unique_courses: { value: number } };
      previous_7_days: { doc_count: number; unique_courses: { value: number } };
    };
    pulses_recent_activities: {
      last_30_days: { doc_count: number; unique_pulses: { value: number } };
      last_7_days: { doc_count: number; unique_pulses: { value: number } };
      previous_30_days: { doc_count: number; unique_pulses: { value: number } };
      previous_7_days: { doc_count: number; unique_pulses: { value: number } };
    };

    content_types: AnalyticsResponseBucket[];
  };

  answers: {
    total_exams: number;
    total_questions: number;
    total_answers: number;
    correct_answers: number;
    correct_ratio: number;
  };

  courses: {
    courses_created: number;
    courses_contributed: number;
    channels_created: number;
    pulses_created: number;
  };
}

export interface UserListStats {
  enrollments: {
    total: number;
    completed: number;
    completed_ratio: number;
  };
  courses: {
    created: number;
    contributed: number;
  };
  profile?: {
    area_of_activity?: string;
    director?: string;
    job?: string;
    manager?: string;
  };
}

/**
 * @deprecated v1 endpoints deprecated
 */
export interface UserSourceV1 {
  user_id: string;
  name: string;
  email: string;
  language_id: string;
  model_type: string;
  origin: string;
  status: boolean;
  created_date: string;
  updated_date: string;
  user_stats: {
    updated_date: string;
    activities: {
      missions_last_30_days: number;
      missions_last_7_days: number;
      missions_previous_last_30_days: number;
      missions_previous_last_7_days: number;
      pulses_last_30_days: number;
      pulses_last_7_days: number;
      pulses_previous_last_30_days: number;
      pulses_previous_last_7_days: number;
      reference_date: string;
      total_missions_activities: number;
      total_pulses_activities: number;
    };
    content_types: [];
    course_categories: [];
    courses: {
      channels_created: number;
      completed: number;
      completed_ratio: number;
      contributed: number;
      created: number;
      total: number;
    };
  };
}

/**
 * @deprecated v1 endpoints deprecated
 */
export interface UserEnrollmentV1 {
  id: string;
  workspace_id: string;
  mission_id: string;
  mission_name: string;
  category_id: string;
  category_name: string;
  category_name_translated?: string;
  status: string;
  start_date: string;
  end_date: string;
  points: number;
  rating: number;
  performance: number;
  activities_total_time: number;
  created_date: string;
  updated_date: string;
}

export interface UserEnrollmentDistributionStats {
  enrollments_per_user: {
    range: string;
    total: number;
    started: number;
    completed: number;
  }[];
}
