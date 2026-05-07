import { BaseEntity } from './base-entity.model';

export interface ExternalMission extends BaseEntity {
  description: string;
  duration_time: number;
  expiration_date: string;
  external: {
    id?: string;
    provider: string;
    course_url: string;
    course_type?: string;
  };
  holder_image: string;
  is_active: boolean;
  is_temporary: boolean;
  language: string;
  mission_category: string;
  mission_type: string;
  name: string;
  thumb_image: string;
  user_creator?: string;
  required_evaluation: boolean;
}
