import { MirroredCourse, PageResponse, UpdateActiveStatusBatchDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { CoursesListPagination, ManagementFilter } from '../../models';

export const init = createAction('[Courses List] Init');

export const loadCategoriesSuccess = createAction(
  '[Courses List] Load Categories Success',
  props<{ categories: string[] }>(),
);

export const loadCoursesList = createAction('[Courses List] Load Courses List');
export const loadCoursesListSuccess = createAction(
  '[Courses List] Load Courses List Success',
  props<{ response: PageResponse<MirroredCourse> }>(),
);

export const setPagination = createAction(
  '[Courses List] Set Pagination',
  props<{ pagination: Partial<CoursesListPagination> }>(),
);

export const sort = createAction('[Courses List] Sort', props<{ sort: string }>());

export const filter = createAction('[Courses List] Filter', props<{ filter: ManagementFilter }>());

export const search = createAction('[Courses List] Search', props<{ search: string }>());

export const deleteCourse = createAction('[Courses List] Delete Course', props<{ courseIds: string[] }>());
export const deleteCourseSuccess = createAction(
  '[Courses List] Delete Course Success',
  props<{ courseIds: string[] }>(),
);
export const deleteCourseFailure = createAction('[Courses List] Delete Course Failure');

export const toggleActiveCourse = createAction(
  '[Courses List] Toggle Active Course',
  props<{ data: UpdateActiveStatusBatchDto }>(),
);
export const toggleActiveCourseSuccess = createAction(
  '[Courses List] Toggle Active Course Success',
  props<{ data: MirroredCourse[] }>(),
);
export const toggleActiveCourseFailure = createAction('[Courses List] Toggle Active Course Failure');

export const openDetailDialog = createAction('[Courses List] Open Detail Dialog', props<{ courseId: string }>());

export const resetState = createAction('[Courses List] Reset State');
