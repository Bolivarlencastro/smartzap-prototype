import { AluraCourse, PageResponse } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { ManagementFilter } from '../../models';

export const openDialog = createAction('[Alura Course Mirror] Open Dialog');

export const dialogClosed = createAction('[Alura Course Mirror] Dialog Closed');

export const loadCoursesList = createAction('[Alura Course Mirror] Load Courses List');
export const loadCoursesListSuccess = createAction(
  '[Alura Course Mirror] Load Courses List Success',
  props<{ response: PageResponse<AluraCourse> }>(),
);

export const setCategories = createAction('[Alura Course Mirror] Set Categories', props<{ categories: string[] }>());

export const mirrorCourses = createAction('[Alura Course Mirror] Mirror Courses', props<{ ids: string[] }>());

export const filter = createAction('[Alura Course Mirror] Filter', props<{ filter: ManagementFilter }>());

export const loadMoreCourses = createAction('[Alura Course Mirror] Load More Courses');

export const loadMoreCoursesSuccess = createAction(
  '[Alura Course Mirror] Load More Courses Success',
  props<{
    response: PageResponse<AluraCourse>;
  }>(),
);

export const loadMoreCoursesFailure = createAction('[Alura Course Mirror] Load More Courses Failure');

export const search = createAction('[Alura Course Mirror] Search', props<{ search: string }>());

export const resetState = createAction('[Alura Course Mirror] Reset State');
