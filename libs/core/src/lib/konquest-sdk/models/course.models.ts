import { DevelopmentStatus } from './kp-status';
import { Enrollment } from './enrollment.models';

export enum COURSE_MODEL {
  INTERNAL = 'INTERNAL',
  EXTERNAL_PROVIDER = 'EXTERNAL_PROVIDER',
  SCORM = 'SCORM',
  LIVE = 'LIVE',
  PRESENTIAL = 'PRESENTIAL',
}

export type Course = {
  id: string;
  name: string;
  required_evaluation?: boolean;
  is_owner?: boolean;
  is_contributor?: boolean;
  enrollment?: Enrollment;
  development_status: DevelopmentStatus;
  description?: string;
  minimum_performance?: number;
  workspace_min_performance?: number;
  min_time_in_content: number;
};

export type CourseStage = {
  id?: string;
  name?: string;
  description?: string;
  order?: number;
  contents?: CourseStageContent[];
  mission?: string;
  questions?: any[];
  user_completed?: boolean;
  stage?: string;
  prev?: number;
  next?: number;
};

export type CourseStageContent = {
  id?: string;
  name?: string;
  description?: string;
  learn_content_id?: string;
  learn_content_uuid?: string;
  learn_content_type?: { id: string; name: string };
  order?: number;
  stage?: string;
  content?: string[];
  user_completed?: boolean;
};

export type STEP_CONTENT_TYPE =
  | 'HTML'
  | 'HTML FILE'
  | 'IMAGE'
  | 'PDF'
  | 'PODCAST'
  | 'PRESENTATION'
  | 'QUESTION'
  | 'SCORM'
  | 'SPREADSHEET'
  | 'SUBJECT'
  | 'TEXT'
  | 'VIDEO';

export interface SupportMaterial {
  id: string;
  mission_id: string;
  kontent_content_id: string;
  title: string;
  description: string;
  order: number;
  content_type_name: string;
  content_type_image: string;
  content_url: string;
  duration: number;
  points: number;
}
