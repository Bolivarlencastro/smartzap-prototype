import { EnrollmentStatuses } from './kp-status';

export interface Enrollment {
  id: string;
  status: EnrollmentStatuses;
  required: boolean;
  created_date?: string;
  start_date?: string;
  end_date?: string;
  updated_date?: string;
  goal_date?: string;
  deleted?: boolean;
  deleted_date?: string;
  enrolled_count?: number;
  give_up?: boolean;
  evaluated?: boolean;
  give_up_comment?: string;
  progress: number;
}

export type EnrollmentResume = {
  performance: number;
  total_awarded_score: number;
  total_available_score: number;
  content_awarded_score: number;
  contents_available_time: number;
  contents_consume_time: number;
  content_available_score: number;
  quiz_available_score: number;
  quiz_awarded_score: number;
  total_correct_answers: number;
  total_mission_questions: number;
};
