import { LearningTrail } from '@app/main/learning-trail/model/learning-trail';
import { Mission, MissionProvider } from 'app/main/mission/mission.model';
import { User } from '.';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export class Enrollment {
  constructor(
    public approve_msg: string,
    public certificate_url: string,
    public certificate_provider_url: string,
    public created_date: string,
    public evaluated: boolean,
    public end_date: string,
    public performance: number,
    public in_progress: boolean,
    public start_date: string,
    public id: string,
    public required: boolean,
    public enrolled_count: number,
    public points: number,
    public give_up: boolean,
    public give_up_comment: string,
    public progress: number,
    public updated_date: string,
    public status: EnrollmentStatuses,
    public user: User,
    public goal_date: string,
    public mission?: Mission,
    public learning_trail?: LearningTrail,
    public provider?: MissionProvider,
    public actual_stage?: string,
    public attended?: boolean,

    public overdueDays?: number,
    public goalDate?: string,
    public startDate?: string,
    public endDate?: string,
    public enrolledCount?: number,
    public actions?: string[],
    public statusColor?: string,

    public disableApproveButton?: boolean,
    public disableRefuseButton?: boolean,
    public disableResendEmailButton?: boolean,
    public provider_icon?: string,
  ) {}
}

export interface TrackStep {
  consumption_status?: ConsumptionStatus;
  id: string;
  mission_enrollment_id: string;
  name: string;
  step_type: 'MISSION' | 'PULSE';
  external_course: boolean;
}

export interface EnrollmentTrackingCollection {
  track: TrackStep;
  contents: EnrollmentTracking[];
}

export interface EnrollmentTracking {
  consumption?: number;
  consume_duration: number;
  content: Content;
  content_duration: number;
  first_access: string;
  last_access: string;
  total_correct_answers: number;
  total_questions: number;
  name: string;
}

export interface ConsumptionStatus {
  color: string;
  icon: string;
}

export interface Content {
  id: string;
  analyzed: boolean;
  content_transcript: string;
  content_type: {
    id: string;
    image: string;
    image_cover: string;
    name: string;
  };
  created_date: string;
  duration: number;
  name: string;
  points: number;
  summary: string;
  updated_date: string;
  url: string;
}

export interface EnrollmentFilter {
  id?: string;
  user?: string;
  status?: string[];
  search?: string;
  per_page?: number;
  page?: number;
  performance__gte?: string;
  performance__lte?: string;
  start_date__gte?: string;
  start_date__lte?: string;
  end_date__gte?: string;
  end_date__lte?: string;
  ordering?: string;
  mission?: string;
  mission_id?: string;
  give_up?: boolean;
  mission_model?: string;
}

export interface ExtendDeadlineDialogData {
  user: string;
  learningObjectName: string;
  startDate: string;
  currentGoalDate: string;
  learnContentType: 'mission' | 'trail';
}

export interface ExtendDeadlinePayload {
  enrollmentId: string;
  userId: string;
  goalDate: string;
}
