import { AnalyticsEventTypes } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
}

export interface CourseCompany {
  id: string;
  company_id: string;
  course_id: string;
}

export interface ContentType {
  id: string;
  name: string;
  description: string;
}

export interface Course {
  id: string;
  category_id: string;
  name: string;
  description: string;
  holder_image: string;
  thumb_image: string;
  duration: string;
  points: number;
  is_active: boolean;
  status: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  name: string;
  description: string;
  order: number;
}

export interface Content {
  id: string;
  lesson_id: string;
  type_id: string;
  name: string;
  url: string;
  description: string;
  order: number;
  dispatch_in: number;
  learn_content: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  points: number;
  performance: number;
  start_date: any;
  end_date: any;
}

export interface Activity {
  id?: string;
  user_id: string;
  content_id: string;
  action: string;
  start_at?: Date;
  stop_at?: Date;
  duration?: number;
}

export interface Actions {
  Podcast: AnalyticsEventTypes;
  Video: AnalyticsEventTypes;
  Image: AnalyticsEventTypes;
  PDF: AnalyticsEventTypes;
  Text: AnalyticsEventTypes;
  Presentation: AnalyticsEventTypes;
  Spreadsheet: AnalyticsEventTypes;
  Blog: AnalyticsEventTypes;
}
