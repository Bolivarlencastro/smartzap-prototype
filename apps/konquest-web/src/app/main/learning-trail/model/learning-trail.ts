import { Enrollment } from '@core/model/enrollment.model';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { Mission, MissionType } from 'app/main/mission/mission.model';
import { Pulse } from '@core/model/pulse.model';

export interface LearningTrailFilter {
  search?: string;
  language?: string[];
  user_creator?: string;
  enrolled?: boolean;
  page?: number;
  per_page?: number;
  is_active?: boolean;
}

export interface LearningTrailEnrollment extends Enrollment {
  learning_trail: LearningTrail;
  progressLeftPosition?: string;
}

export interface LearningTrailEnrollmentFilter {
  user?: string;
  status?: string[];
  search?: string;
  per_page?: number;
  page?: number;
  performance__lte?: string;
  start_date__gte?: string;
  start_date__lte?: string;
  end_date__gte?: string;
  end_date__lte?: string;
  give_up?: boolean;
  is_active?: boolean;
  ordering?: string;
}

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
  learning_trail_type: LearningTrailType | string;
  steps?: Step[];
  enrollment: LearningTrailEnrollment;
  progress?: number;
  mission_type?: string;
  user_creator: any; // dados do usuário criado
  count_missions: number; // quantas missões tem vinculada
  count_pulses: number; // quantos pulses tem vinculados
  users_finished: number; // quantos usuários já realizaram essa trilha
  users_enrolled: number; // quanto usuários estão com matrículas ativas
  is_owner: boolean; // se o usuário logado é o dono
  enrolled: boolean; // se o usuário logado está matriculado
  tags?: any;
}

export interface LearningTrailType {
  created_date: string;
  description: string;
  id: string;
  image: string;
  name: string;
  updated_date: string;
}

export interface Step {
  id: string;
  learning_trail: string;
  learning_trail_name: string;
  mission: Mission;
  order: number;
  pulse: Pulse;
}

export interface ContentStep {
  name?: string;
  id?: string;
  learningTrailContentId?: string;
  mission?: any;
  pulse?: any;
  order?: number;
  mission_type?: string | MissionType;
  description?: string;
}

export type TrailLearnContent = {
  id: string;
  name: string;
  content_type: 'course' | 'event' | 'pulse';
};

export type CreateLearnContentEvent = TrailLearnContent & {
  order: number;
};

export interface LearningTrailNavigationContext {
  mission?: Mission;
  pulseId?: string;
  trailId?: string;
  openDetail?: boolean;
}

export type LearningTrailListPayload = { count: number; finished: boolean; results: LearnContentCardData[] };
