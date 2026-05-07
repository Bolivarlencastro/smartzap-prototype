import { createAction, props } from '@ngrx/store';
import { CollectionResponse, Page } from 'app/shared/model';
import { Course } from '../../model';
import { CoursesFilter } from '../reducers/courses.reducer';
import { SortParams } from '@keeps-platform-frontend-workspace/kp-keeps';

export const initializeCourses = createAction('[Courses] Initialize Courses Component');

export const loadCourses = createAction('[Courses] Load Courses', props<{ page: Page }>());

export const loadCoursesSuccess = createAction(
  '[Courses] Load Courses Success',
  props<{ payload: CollectionResponse<Course> }>(),
);

export const loadCoursesFailure = createAction('[Courses] Load Courses Failure', props<{ error: Error }>());

export const searchCourses = createAction('[Courses] Search Courses', props<{ term: string }>());

export const reset = createAction('[Courses] Reset State');

export const setPagination = createAction(
  '[Courses] Set Pagination',
  props<{ currentPage: number; per_page: number }>(),
);

export const setFilter = createAction('[Courses] Set Filter', props<{ filters: CoursesFilter | null }>());

export const setSort = createAction('[Courses] Set Sort', props<{ sort: SortParams }>());

export const setPage = createAction('[Courses] Set Page', props<{ page: number }>());
