import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Enrollment, Mission } from '../../kp-mission-model/model';

export interface LearningTrail {
  id: string;
  name: string;
  description: string;
  holder_image: string;
  thumb_image: string;
  duration_time: number;
  points: string;
  is_active: boolean;
  language: string;
  expiration_date: string;
  created_date: string;
  updated_date: string;
  progress?: number;
  mission_type?: string;
  user_creator: any;
  count_missions: number;
  count_pulses: number;
  users_finished: number;
  users_enrolled: number;
  is_owner: boolean;
  enrolled: boolean;
  enrollment: LearningTrailEnrollment;
}

export interface LearningTrailEnrollment {
  status: EnrollmentStatuses;
  give_up: boolean;
}

export interface Step {
  id: string;
  learning_trail: string;
  learning_trail_name: string;
  mission: Mission;
  order: number;
  pulse: Pulse;
  tags?: any;
}

export type TrailStepType = 'mission' | 'pulse';

export interface StepCertificateAction {
  type: string;
  step: Step;
}

export interface StepCertificate {
  action: string;
  id: string;
}

export interface TrailStepItem {
  id?: string;
  name?: string;
  description?: string;
  type?: TrailStepType;
  listIndex?: string;
  durationTime?: number;
  externalCourse?: string;
  startDate?: string;
  endDate?: string;
  isCompleted?: boolean;
  isInProgress?: boolean;
  performance?: number;
  progress?: number;
  performanceColor?: string;
  step?: Step;
  disabled?: boolean;
  disabledInfo?: string;
  status?: string;
  language?: string;
  duration?: number;
  missionModel?: string;
  development_status?: DevelopmentStatus;
  isOwner?: boolean;
}

export interface Pulse {
  id?: string;
  rating_avg?: number;
  rating_count?: number;
  name: string;
  description?: string;
  holder_image?: string;
  learn_content_uuid: string;
  created_date: string;
  updated_date: string;
  duration_time: number;
  points?: number;
  bookmark_id?: string;
  isOwner?: boolean;
  consume_time_in?: number;
  consumed: boolean;
  enrollment?: Enrollment;
  views?: number;
  language?: string;
}
