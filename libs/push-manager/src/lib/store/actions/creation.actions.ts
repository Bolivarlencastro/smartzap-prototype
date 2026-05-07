import { PushTemplate, SmartzapCourse } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

const loadData = createAction('[Push Manager - Creation] Load Data');
const loadDataSuccess = createAction(
  '[Push Manager - Creation] Load Data Success',
  props<{ templates: PushTemplate[] }>(),
);
const loadDataFailure = createAction('[Push Manager - Creation] Load Data Failure');

const loadCourses = createAction('[Push Manager - Creation] Load Courses', props<{ term: string }>());
const loadCoursesSuccess = createAction(
  '[Push Manager - Creation] Load Courses Success',
  props<{ courses: SmartzapCourse[] }>(),
);

export const CreationActions = {
  loadData,
  loadDataSuccess,
  loadDataFailure,
  loadCourses,
  loadCoursesSuccess,
};
