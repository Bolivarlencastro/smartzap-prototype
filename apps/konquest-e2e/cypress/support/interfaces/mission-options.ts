import { FixtureContent } from './content-options';
import { FixtureEnrollment } from './enrollment-options';
export interface MissionTypeContentOptions {
  contentType?: boolean;
  video?: boolean;
  image?: boolean;
  poadcast?: boolean;
  PDF?: boolean;
  doc?: boolean;
  ppt?: boolean;
  sheet?: boolean;
}

export interface MissionContentVideoOptions {
  file: string;
  name?: string;
}
export interface ScormMissionCreate {
  id?: string;
  user_creator?: {
    id: string;
    name: string;
    avatar: string;
  };
  external_course_url?: string;
  learning_trail_linked?: string;
  is_owner?: boolean;
  mission_type?: {
    id: string;
    name: string;
    image: string;
  };
  mission_category?: {
    id: string;
    name: string;
  };
  stages?: number;
  rating_avg?: number;
  users_enrolled?: number;
  is_contributor?: number;
  bookmark_id?: string;
  enrollments_accepted?: number;
  workspace_min_performance?: number;
  workspace_source_id?: string;
  is_active?: boolean;
  tags?: [];
  enrollment?: string;
  content_resume?: [
    {
      id: string;
      created_date: string;
      updated_date: string;
      deleted_date: string;
      deleted: boolean;
      name: string;
      image: string;
      image_cover: string;
      count: number;
      mission: string;
    },
  ];
  contributors?: [];
  users_finished?: number;
  created_date?: string;
  updated_date?: string;
  deleted_date?: string;
  deleted?: boolean;
  name?: string;
  description?: string;
  holder_image?: string;
  vertical_holder_image?: string;
  thumb_image?: string;
  summary?: string;
  duration_time?: string;
  points?: number;
  internal_code?: string;
  _is_active?: boolean;
  development_status?: string;
  language?: string;
  expiration_date?: string;
  mission_model?: string;
  required_evaluation?: boolean;
  assessment_type?: string;
  allow_self_enrollment_renewal?: boolean;
  allow_self_reproved_enrollment_renewal?: boolean;
  minimum_performance?: number;
  category?: string;
  missionUUID?: string;
}

export interface MissionEnrollOptions {
  messageStartCourse: string;
}

export interface InternalMissionOptions {
  id?: string;
  missionUUID?: string;
  name?: string;
  mission_category?: string;
  mission_type?: {
    id: string;
    name?: string;
    image?: string;
  };
  description?: string;
  language?: string;
  language_api?: string;
  is_active?: boolean;
  user_creator?: { id?: string; name?: string; avatar?: string };
  mission_model?: string;
  duration_time?: string;
  development_status?: string;
  holder_image?: string;
  vertical_holder_image?: string;
  thumb_image?: string;
  order?: string;
  rating?: string;
  userUUID?: string;
  allow_self_enrollment_renewal?: boolean;
  allow_self_reproved_enrollment_renewal?: boolean;
  required_evaluation?: boolean;
  assessment_type?: string;
  enrollment_goal_duration_days?: string;
  external?: {
    course_url: string;
    course_type: string;
    provider: string;
    duration_time: string;
  };
}

export interface ContentStageOptions {
  name: string;
  mission: string;
  genially_content_type_id: string;
  content_type_id: string;
  content_type: string;
  created_date: string;
  id: string;
  description: string;
  learn_content_uuid: string;
  order: string;
  stage: string;
  updated_date: string;
  link: string;
  exam_questions: string;
}

export interface APIMissionEnrollmentEvaluationOp {
  missionUUID: string;
  userUUID: string;
  id: string;
  evaluations: any;
}

export interface MissionStageOptions {
  name: string;
  order: string;
  mission: string;
  missionUUID: string;
}

export interface MissionStageContentOptions {
  mission?: InternalMissionOptions;
  stage?: MissionStageOptions;
  content?: FixtureContent;
  enrollment?: FixtureEnrollment;
}

export interface MissionTopicOptions {
  link: string;
  title: string;
}

export interface MissionRequestOptions {
  id?: string;
  name?: string;
}

export interface MissionQuizOptions {
  question: {
    position: number;
    text: string;
  };
  option1: {
    position: number;
    text: string;
  };
  option2: {
    position: number;
    text: string;
  };
  option3: {
    position: number;
    text: string;
  };
}
