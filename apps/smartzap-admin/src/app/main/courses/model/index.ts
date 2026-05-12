export * from './enrollment';
export * from './question';

import { BaseEntity } from 'app/shared/model';

export interface LanguagesApiResponse {
  idioms: Language[];
}

export interface ImageUploadApiResponse {
  name: string;
  url: string;
}

export interface Course extends BaseEntity {
  description: string;
  message_description?: string;
  duration?: string;
  category_id: string;
  is_active?: boolean;
  lang: string;
  name: string;
  points?: number;
  status?: string;

  holder_image?: string;
  thumb_image?: string;

  category?: Category;
  lessons?: Lesson[];
  total_contents?: number;
  total_lessons?: number;
  total_users_enrolled?: number;
  total_users_in_progress?: number;
  total_users_completed?: number;
  user_creator?: any;
  version?: string;

  content_performance_weight: number;
  quiz_performance_weight: number;
  disable_send_certificate: boolean;
  certificate_id?: string;
  enable_native_nps?: boolean;
}

export interface Category extends BaseEntity {
  description: string;
  name: string;
}
export interface Lesson extends BaseEntity {
  contents: Content[];
  course_id: string;
  description: string;
  name: string;
  order: number;
}
export interface Content extends BaseEntity {
  description: string;
  dispatch_in: number;
  dispatch_period: string;
  learn_content: string;
  lesson_id: string;
  name: string;
  order: number;
  type_id: string;
  type?: ContentType;
  exam_type?: string;
}
export interface Language {
  name: string;
  value: string;
}

export interface ContentType extends BaseEntity {
  description: string;
  image_url: string;
  name: string;
}

export interface CourseFlag {
  class: string;
  description: string;
}

export const SURVEY_TYPE_ID = '7a3c8d1e-9f2b-4a5c-8e1d-2b3c4d5e6f7a';
export const EVALUATIVE_TYPE_ID = '7a41a8e0-ee37-4d0b-ad4f-35bada67134d';
