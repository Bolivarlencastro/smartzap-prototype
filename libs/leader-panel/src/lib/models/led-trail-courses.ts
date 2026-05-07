import { Enrollment } from './enrollment';

export interface LedTrailCoursesModel {
  learn_content_name: string;
  username: string;
  course_enrollments: Enrollment[];
}

export interface LedTrailCoursesViewModel {
  data: LedTrailCoursesModel;
  loading: boolean;
}
