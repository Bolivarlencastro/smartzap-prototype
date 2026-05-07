import { Sort } from '@angular/material/sort';
import { createAction, props } from '@ngrx/store';
import { Course } from '../../../models/course';
import { SearchPageResponse } from '@keeps-platform-frontend-workspace/kp-keeps';

const init = createAction('[Course List] Init');

const fetchCourses = createAction('[Course List] Fetch Courses');
const fetchCoursesSuccess = createAction(
  '[Course List] Fetch Courses Success',
  props<{ response: SearchPageResponse<Course> }>(),
);
const fetchCoursesFailure = createAction('[Course List] Fetch Courses Failure');

const search = createAction('[Course List] Search', props<{ search: string }>());

const sort = createAction('[Course List] Sort', props<{ sort: Sort }>());

const setPagination = createAction('[Course List] Set Pagination', props<{ page: number; per_page: number }>());

export const CourseListActions = {
  init,
  fetchCourses,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  search,
  sort,
  setPagination,
};
