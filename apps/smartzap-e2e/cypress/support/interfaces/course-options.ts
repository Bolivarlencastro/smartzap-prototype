export interface CourseOptions {
  name: string;
  id?: string;
  description: string;
  category?: string;
  category_id: string;
  lang: string;
  is_active: boolean;
  status: string;
  content_performance_weight?: number;
  allow_drop_out?: boolean;
  quiz_performance_weight: number;
  allow_content_anticipation: boolean;
  disable_send_certificate: boolean;
}

export interface CourseFields {
  name: string;
  category: string;
  duration: string;
  subscribers: string;
  usersCompleted: string;
  courseStatus: string;
  description?: string;
}
