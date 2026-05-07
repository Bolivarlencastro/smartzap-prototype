import { CaixaCourseCategory } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface CoursesListViewModel {
  loading: boolean;
  categories: CaixaCourseCategory[];
}
