import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Enrollment } from '../../../models/enrollment';
import { LedTrailCoursesViewModel } from '../../../models/led-trail-courses';
import { LedOverviewActions, LedTrailCoursesActions } from '../actions';
import { ledOverviewFeature } from './led-overview.feature';

export const LED_TRAIL_COURSES_FEATURE_KEY = 'lpLedTrailCourses';

export interface LedTrailCoursesFeatureState {
  id: string;
  name: string;
  loading: boolean;
  enrollments: Enrollment[];
}

export const ledTrailCoursesInitialState: LedTrailCoursesFeatureState = {
  id: null,
  name: null,
  loading: false,
  enrollments: null,
};

export const ledTrailCoursesReducer = createReducer(
  ledTrailCoursesInitialState,

  on(LedTrailCoursesActions.fetchEnrollments, (state, { trailEnrollment }): LedTrailCoursesFeatureState => {
    const { learn_content_name, id } = trailEnrollment;
    return { ...state, loading: true, id, name: learn_content_name };
  }),

  on(
    LedTrailCoursesActions.fetchEnrollmentsSuccess,
    (state, { enrollments }): LedTrailCoursesFeatureState => ({ ...state, loading: false, enrollments }),
  ),

  on(
    LedTrailCoursesActions.fetchEnrollmentsFailure,
    (state): LedTrailCoursesFeatureState => ({ ...state, loading: false }),
  ),

  on(LedOverviewActions.resetState, (): LedTrailCoursesFeatureState => ledTrailCoursesInitialState),
);

export const ledTrailCoursesFeature = createFeature({
  name: LED_TRAIL_COURSES_FEATURE_KEY,
  reducer: ledTrailCoursesReducer,
  extraSelectors: ({ selectEnrollments, selectLoading, selectName }) => ({
    selectViewModel: createSelector(
      selectLoading,
      selectEnrollments,
      selectName,
      ledOverviewFeature.selectSelectedUser,
      (loading, enrollments, name, user): LedTrailCoursesViewModel => ({
        data: {
          course_enrollments: enrollments,
          username: user.name,
          learn_content_name: name,
        },
        loading,
      }),
    ),
  }),
});
