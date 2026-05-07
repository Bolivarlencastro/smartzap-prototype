import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Course } from '../../../models/course';
import { CourseDialogData, CourseDialogViewModel } from '../../../models/course-dialog';
import { CourseDialogActions } from '../actions';

export interface CourseDialogFeatureState {
  selectedCourse: Course;
  loading: boolean;
  data: CourseDialogData;
}

export const courseDialogInitialState: CourseDialogFeatureState = {
  selectedCourse: null,
  loading: true,
  data: null,
};

const reducer = createReducer(
  courseDialogInitialState,

  on(
    CourseDialogActions.openDialog,
    (state, { selectedCourse }): CourseDialogFeatureState => ({ ...state, selectedCourse }),
  ),

  on(
    CourseDialogActions.fetchDataSuccess,
    (state, { data }): CourseDialogFeatureState => ({ ...state, loading: false, data }),
  ),

  on(CourseDialogActions.fetchDataFailure, (state): CourseDialogFeatureState => ({ ...state, loading: false })),

  on(CourseDialogActions.resetState, (): CourseDialogFeatureState => courseDialogInitialState),
);

export const courseDialogFeature = createFeature({
  name: 'course-dialog',
  reducer,
  extraSelectors: ({ selectSelectedCourse, selectLoading, selectData }) => ({
    selectCourseId: createSelector(selectSelectedCourse, (course): string => course.course_id),
    selectViewModel: createSelector(
      selectSelectedCourse,
      selectLoading,
      selectData,
      (course, loading, data): CourseDialogViewModel => ({ course, loading, data }),
    ),
  }),
});
