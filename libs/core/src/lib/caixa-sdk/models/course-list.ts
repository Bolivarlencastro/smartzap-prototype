export interface CourseListFilter {
  search?: string;
  page?: number;
  perPage?: number;
  category_id?: string;
}

export interface CaixaCourseCategory {
  name: string;
  id: string;
}

export interface CaixaCourse {
  id: string;
  name: string;
  holder_image: string;
  thumb_image: string;
  description: string;
  created: string;
  updated: string;
  is_active: string;
  category: CaixaCourseCategory;
  lang: string;
  duration: number;
}
