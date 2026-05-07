import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LedEnrollmentActivityModel, LedEnrollmentActivityViewModel } from '../../../models/led-enrollment-activity';
import { LedEnrollmentActivityActions, LedOverviewActions } from '../actions';

export const LED_ENROLLMENT_ACTIVITY_FEATURE_KEY = 'lpLedEnrollmentActivity';

export interface LedEnrollmentActivityFeatureState {
  courseId: string;
  loading: boolean;
  data: LedEnrollmentActivityModel;
}

export const ledEnrollmentActivityInitialState: LedEnrollmentActivityFeatureState = {
  loading: false,
  data: null,
  courseId: null,
};

export const ledEnrollmentActivityReducer = createReducer(
  ledEnrollmentActivityInitialState,

  on(
    LedEnrollmentActivityActions.fetchData,
    (state, { courseId }): LedEnrollmentActivityFeatureState => ({ ...state, loading: true, courseId }),
  ),

  on(
    LedEnrollmentActivityActions.fetchDataSuccess,
    (state, { data }): LedEnrollmentActivityFeatureState => ({ ...state, loading: false, data }),
  ),

  on(
    LedEnrollmentActivityActions.fetchDataFailure,
    (state): LedEnrollmentActivityFeatureState => ({ ...state, loading: false }),
  ),

  on(LedOverviewActions.resetState, (): LedEnrollmentActivityFeatureState => ledEnrollmentActivityInitialState),
);

export const ledEnrollmentActivityFeature = createFeature({
  name: LED_ENROLLMENT_ACTIVITY_FEATURE_KEY,
  reducer: ledEnrollmentActivityReducer,
  extraSelectors: ({ selectData, selectLoading }) => ({
    selectViewModel: createSelector(
      selectData,
      selectLoading,
      (data, loading): LedEnrollmentActivityViewModel => ({
        data,
        loading,
      }),
    ),
  }),
});
