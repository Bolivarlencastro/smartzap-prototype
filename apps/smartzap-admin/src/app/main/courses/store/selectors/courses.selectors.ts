import { createSelector } from '@ngrx/store';
import { selectCoursesFeatureState, CoursesState } from '../reducers';
import * as fromUsers from '../reducers/courses.reducer';

export const selectCollectionState = createSelector(
  selectCoursesFeatureState,
  (state: CoursesState) => state?.collection,
);

export const selectCourses = createSelector(selectCollectionState, fromUsers?.selectAll);

export const selectLoading = createSelector(selectCollectionState, (state) => state?.isLoading);

export const selectPage = createSelector(selectCollectionState, (state) => {
  return { ...state?.page, page: Math.max(state?.page?.page - 1, 0) };
});

export const selectSearchTerm = createSelector(selectCollectionState, (state) => state?.term);

export const selectFilters = createSelector(selectCollectionState, (state) => state?.filters);

export const selectSort = createSelector(selectCollectionState, (state) => state?.sort);

export interface CourseSummary {
  total: number;
  finished: number;
  creating: number;
  reviewing: number;
  inactive: number;
}

export const selectCourseSummary = createSelector(selectCourses, selectPage, (courses, page): CourseSummary => {
  const summary = { total: page?.count || 0, finished: 0, creating: 0, reviewing: 0, inactive: 0 };
  courses.forEach((course) => {
    if (!course.is_active) {
      summary.inactive++;
      return;
    }
    if (course.status === 'FINISHED') summary.finished++;
    else if (course.status === 'CREATING') summary.creating++;
    else if (course.status === 'REVIEWING') summary.reviewing++;
  });
  return summary;
});
