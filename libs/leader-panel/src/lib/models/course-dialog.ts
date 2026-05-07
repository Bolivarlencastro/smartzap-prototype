import { Course } from './course';
import { Enrollment } from './enrollment';

export interface CourseDialogViewModel {
  course: Course;
  loading: boolean;
  data: CourseDialogData;
}

export interface CourseDialogData {
  enrollments: CourseDialogEnrollment[];
  notEnrolled: CourseDialogUser[];
  associatedTrails: CourseDialogLearnContent[];
}

export interface CourseDialogUser {
  id: string;
  name: string;
  avatar: string;
  jobPosition: string;
}

export interface CourseDialogLearnContent {
  id: string;
  name: string;
  learn_content_type: 'course' | 'trail' | 'pulse';
  progress: number;
}

export type CourseDialogEnrollment = Partial<Enrollment> & CourseDialogUser;
