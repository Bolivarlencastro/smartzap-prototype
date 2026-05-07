export interface CoursesFilterModel {
  page: number;
  per_page: number;
  name__ilike?: string;
}

export interface SmartzapCourse {
  id: string;
  created: string;
  updated: string;
  description: string;
  duration: string;
  category_id: string;
  is_active: boolean;
  lang: string;
  name: string;
  points: number;
  status: string;
  holder_image: string;
  thumb_image: string;
  category: unknown;
  lessons: unknown;
  total_contents: number;
  total_lessons: number;
  total_users_enrolled: number;
  total_users_completed: number;
  user_creator: any;
  content_performance_weight: number;
  quiz_performance_weight: number;
  disable_send_certificate: boolean;
}

export interface SmartzapPagination<T> {
  count: number;
  page: number;
  per_page: number;
  result: T[];
  total_pages: number;
}
