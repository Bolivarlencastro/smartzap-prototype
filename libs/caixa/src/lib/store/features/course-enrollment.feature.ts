import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CourseEnrollmentActions } from '../actions';
import { CourseEnrollmentViewModel } from '../../models';

export interface CourseEnrollmentFeatureState {
  courseId: string;
  isSaving: boolean;
}

export const courseEnrollmentInitialState: CourseEnrollmentFeatureState = {
  courseId: null,
  isSaving: false,
};

export const courseEnrollmentReducer = createReducer(
  courseEnrollmentInitialState,

  on(
    CourseEnrollmentActions.openDialog,
    (state, { courseId }): CourseEnrollmentFeatureState => ({ ...state, courseId }),
  ),

  on(CourseEnrollmentActions.enroll, (state): CourseEnrollmentFeatureState => ({ ...state, isSaving: true })),

  on(
    CourseEnrollmentActions.enrollFailure,
    CourseEnrollmentActions.openEnrollmentResultDialog,
    (state): CourseEnrollmentFeatureState => ({
      ...state,
      isSaving: false,
    }),
  ),

  on(CourseEnrollmentActions.reset, (): CourseEnrollmentFeatureState => courseEnrollmentInitialState),
);

export const courseEnrollmentFeature = createFeature({
  name: 'courseEnrollment',
  reducer: courseEnrollmentReducer,
  extraSelectors: ({ selectCourseId, selectIsSaving }) => ({
    selectViewModel: createSelector(selectCourseId, selectIsSaving, (courseId, isSaving): CourseEnrollmentViewModel => {
      return {
        courseId,
        isSaving,
      };
    }),
  }),
});
