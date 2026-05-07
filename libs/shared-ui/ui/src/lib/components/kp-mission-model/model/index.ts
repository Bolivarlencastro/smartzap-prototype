import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearningTrail } from '../../kp-learning-trail-detail-steps/model';

export interface Mission {
  id?: string;
  created_date?: string;
  description?: string;
  users_enrolled?: number;
  development_status?: DevelopmentStatus;
  duration_time?: number;
  enrolled?: boolean;
  enrollment?: Enrollment;
  expiration_date?: string;
  external_course_url?: string;
  holder_image?: string | null;
  users_finished?: string;
  is_active?: boolean;
  is_owner?: boolean;
  is_contributor?: boolean;
  managed?: boolean;
  match?: number;
  learning_trail_linked?: boolean;
  name?: string;
  points?: number;
  provider?: MissionProvider | string;
  provider_mission_type?: string;
  rating?: number;
  summary?: string;
  subtitle?: string;
  rating_avg?: number;
  rating_count?: number;
  routerLink?: string;
  routerName?: string;
  tags?: MissionTag[];
  thumb_image?: string | null;
  user_progress?: number;
  is_temporary?: boolean;
  vertical_holder_image?: string | null;
  required_evaluation?: boolean;
  assessment_type?: string;
  imageDefinition?: any;
  allow_self_enrollment_renewal?: boolean;
  allow_self_reproved_enrollment_renewal?: boolean;
  minimum_performance?: number;
  workspace_min_performance?: number;
  workspace_source_id?: string;
  bookmark_id?: string;
  mission_model?: string;
  language?: string;
  user_creator?: UserCreator;
}

export interface UserCreator {
  id?: string;
  name?: string;
  avatar?: string;
  icon_url?: string;
}

export interface MissionProvider {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface MissionTag {
  name?: string;
  relevance?: number;
  id?: string;
}

export interface Enrollment {
  id: string;
  end_date: string;
  performance: number;
  start_date: string;
  progress: number;
  status: EnrollmentStatuses;
  required: boolean;
  learning_trail?: LearningTrail;
}
