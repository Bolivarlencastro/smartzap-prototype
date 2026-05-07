import { AluraCourse, DevelopmentStatus, MirroredCourse } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface MirroredCoursesViewModel {
  items: MirroredCourse[];
  loading: boolean;
  pagination?: CoursesListPagination;
  hasAppliedFilter?: boolean;
  categories?: string[];
}

export interface MirrorCourseDialogViewModel {
  items: AluraCourse[];
  loading: boolean;
  pagination?: CoursesListPagination;
  hasAppliedFilter?: boolean;
  categories?: string[];
}

export interface CoursesListPagination {
  totalItems: number;
  perPage: number;
  currentPage: number;
}

export enum AluraStatus {
  PUBLISHED = 'PUBLISHED',
  DISABLED = 'DISABLED',
}

export type MirroredCourseStatus = AluraStatus | DevelopmentStatus;
