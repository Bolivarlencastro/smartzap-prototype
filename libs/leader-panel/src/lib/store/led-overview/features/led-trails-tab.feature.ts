import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Enrollment } from '../../../models/enrollment';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LedEnrollmentsTabViewMode, LedEnrollmentsTabViewModel } from '../../../models/led-overview';
import { LedOverviewActions, LedTrailsTabActions } from '../actions';

export const LED_TRAILS_FEATURE_KEY = 'ledTrailsTab';

export interface LedTrailsFeature extends EntityState<Enrollment> {
  viewMode: LedEnrollmentsTabViewMode;
  loaded: boolean;
}

const adapter = createEntityAdapter<Enrollment>();

export const ledTrailsInitialState: LedTrailsFeature = adapter.getInitialState({
  viewMode: 'loading',
  loaded: false,
});

const reducer = createReducer(
  ledTrailsInitialState,

  on(LedTrailsTabActions.fetchTrailEnrollmentsSuccess, (state, { enrollments }): LedTrailsFeature => {
    return adapter.setAll<LedTrailsFeature>(enrollments, { ...state, viewMode: 'list', loaded: true });
  }),

  on(LedTrailsTabActions.setViewMode, (state, { viewMode }): LedTrailsFeature => ({ ...state, viewMode })),

  on(LedOverviewActions.resetState, (): LedTrailsFeature => ledTrailsInitialState),
);

export const ledTrailsTabFeature = createFeature({
  name: LED_TRAILS_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectLedTrailsTabState, selectViewMode }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectLedTrailsTabState).selectAll,
      selectViewMode,
      (enrollments, viewMode): LedEnrollmentsTabViewModel => ({ enrollments, viewMode }),
    ),
    selectIsLoaded: createSelector(selectLedTrailsTabState, (state) => {
      return state.loaded;
    }),
  }),
});
