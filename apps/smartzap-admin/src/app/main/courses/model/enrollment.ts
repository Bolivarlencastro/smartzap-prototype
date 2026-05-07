import { BaseEntity } from 'app/shared/model';
import { Course, Lesson } from '.';

export interface Enrollment extends BaseEntity {
  workspace_id: string;
  course_id: string;
  created_on: string;
  current_content: string;
  current_content_id: string;
  current_lesson: Lesson;
  current_lesson_id: string;
  end_date: string;
  performance: number;
  points: string;
  progress: number;
  start_date: string;
  status: string;
  timezone: string;
  user: EnrollmentUser;
  user_id: string;
  selected: boolean;
  course: Pick<Course, 'id' | 'name'>;
  messages_pending_count: number;
  messages_sent_count: number;
  certificate_url?: string;
}

export interface EnrollmentUser extends BaseEntity {
  email: string;
  name: string;
  phone: string;
  tags: string;
}

export interface EnrollmentUserError extends EnrollmentUser {
  error: string[];
  myacc?: boolean;
}

export interface EnrollmentError extends EnrollmentUserError {
  avatar: string;
  my_account_user: boolean;
  sync_check?: string;
}

export interface EnrollmentApiResponse {
  enrollment_errors: EnrollmentError[];
  enrollments: Enrollment[];
  user_errors: EnrollmentUserError[];
}
