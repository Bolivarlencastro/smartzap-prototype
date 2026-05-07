import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Enrollment } from '../../../models/enrollment';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LedCoursesTabActions, LedOverviewActions } from '../actions';
import { LedEnrollmentsTabViewMode, LedEnrollmentsTabViewModel } from '../../../models/led-overview';

export const LED_COURSES_TAB_FEATURE_KEY = 'ledCoursesTab';

export interface LedCoursesFeatureState extends EntityState<Enrollment> {
  viewMode: LedEnrollmentsTabViewMode;
  loaded: boolean;
}

const adapter: EntityAdapter<Enrollment> = createEntityAdapter<Enrollment>();

export const ledCoursesInitialState: LedCoursesFeatureState = adapter.getInitialState({
  viewMode: 'loading',
  loaded: false,
});

const reducer = createReducer(
  ledCoursesInitialState,

  on(LedCoursesTabActions.fetchEnrollmentsSuccess, (state, { enrollments }): LedCoursesFeatureState => {
    return adapter.setAll<LedCoursesFeatureState>(enrollments, { ...state, viewMode: 'list', loaded: true });
  }),

  on(LedCoursesTabActions.setViewMode, (state, { viewMode }): LedCoursesFeatureState => ({ ...state, viewMode })),

  on(LedOverviewActions.resetState, (): LedCoursesFeatureState => ledCoursesInitialState),
);

export const ledCoursesTabFeature = createFeature({
  name: LED_COURSES_TAB_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectLedCoursesTabState, selectViewMode }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectLedCoursesTabState).selectAll,
      selectViewMode,
      (enrollments, viewMode): LedEnrollmentsTabViewModel => ({ enrollments, viewMode }),
    ),
    selectLoaded: createSelector(selectLedCoursesTabState, (state) => {
      return state.loaded;
    }),
  }),
});
