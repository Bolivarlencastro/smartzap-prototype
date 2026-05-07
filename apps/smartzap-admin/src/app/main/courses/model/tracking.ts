import { Content } from '.';

export interface Tracking {
  idGenerated: number;
  content_name: string;
  content_type: ContentType;
  first_access: any;
  last_access: any;
  duration: number;
  content_duration: number;
  learn_duration: any;
  total_correct_answers: number;
  total_questions: number;
  schedule_status: string;
  content: Content;
}

export interface ContentType {
  id: any;
  name: string;
}

export interface RenewAccess {
  enrollment_id: string;
  content_id: string;
}
