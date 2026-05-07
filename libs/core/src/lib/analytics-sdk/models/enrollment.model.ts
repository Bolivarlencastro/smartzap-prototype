import { AnalyticsResponse, BaseElasticData } from '.';

export type EnrollmentListResponse = AnalyticsResponse<BaseElasticData<EnrollmentSource, EnrollmentDataStats>>;

export interface EnrollmentSource {
  id: string;
  status: string;
  points: number;
  performance: number;
  progress: number;
  give_up: boolean;
  give_up_comment: string;

  user_id: string;
  user_name: string;
  user_avatar: string;
  workspace_id: string;
  course_id: string;
  course_name: string;
  category_id: string;
  category_name: string;
  category_name_translated?: string; // post-calculated

  goal_date: string;
  start_date: string;
  end_date: string;
  created_date: string;
  updated_date: string;
  questions: {
    questions_answered: number;
    questions_answered_correctly: number;
    questions_answered_correctly_ratio: number;
    questions_answered_ratio: number;
    questions_total: number;
  };
}

export interface EnrollmentDataStats {
  ratings: {
    value: number;
  };
  activities: {
    total_seconds: number;
  };
}
