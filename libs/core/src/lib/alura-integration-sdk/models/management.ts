export interface CoursesListFilter {
  name?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  category?: string[];
  status?: string[];
  created_date_gte?: Date;
  created_date_lte?: Date;
}

export interface AluraCourse {
  id: string;
  name: string;
  category: string;
  status: string;
  link: string;
  created_date?: string;
}

export interface MirroredCourse {
  id: string;
  name: string;
  category: string;
  status: string;
  isActive: boolean;
  link: string;
  mirror_date?: string;
  createdAt?: string;
  missionId: string;
}
