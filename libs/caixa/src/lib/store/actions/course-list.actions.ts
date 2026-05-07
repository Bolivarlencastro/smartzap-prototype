import { CaixaCourse, CaixaCourseCategory, CourseListFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { CardAction } from '../../models';

export const init = createAction('[Course List] Init');

export const loadCourses = createAction('[Course List] Load Courses');

export const loadCoursesSuccess = createAction(
  '[Course List] Load Courses Success',
  props<{
    response: CaixaCourse[];
  }>(),
);

export const filterCourses = createAction('[Course List] Filter Courses', props<{ filter: CourseListFilter }>());

export const getCourseToOpenDetails = createAction(
  '[Course List] Get Course To Open Details',
  props<{ courseId: string }>(),
);

export const openCourseDetails = createAction(
  '[Course List] Open Course Details',
  props<{
    course: CaixaCourse;
  }>(),
);

export const saveCourseIdToOpenDetails = createAction(
  '[Course List] Save Course Id To Open Details',
  props<{ courseId: string }>(),
);

export const dispatchAction = createAction('[Course List] Dispatch Action', props<{ action: CardAction }>());

export const manageQueryParamsToOpenCourse = createAction(
  '[Course List] Manage Query Params To Open Course',
  props<{ courseId: string }>(),
);

export const shareCourse = createAction('[Course List] Share Course', props<{ courseId: string }>());

export const loadCategoriesSuccess = createAction(
  '[Course Categories] Load Categories Success',
  props<{ categories: CaixaCourseCategory[] }>(),
);

export const detailsDialogClosed = createAction('[Course Details] Details Dialog Closed');
