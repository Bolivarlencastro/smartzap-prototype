import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LedEventItem } from '../../../models/led-event-item';
import { ListViewModel } from '../../../models/list';
import { LedEventTabActions, LedOverviewActions } from '../actions';

export const LED_EVENT_TAB_FEATURE_KEY = 'lpLedEventTab';

export interface LedEventTabFeatureState {
  loading: boolean;
  events: LedEventItem[];
}

export const ledEventTabInitialState: LedEventTabFeatureState = {
  loading: true,
  events: [],
};

export const ledEventTabReducer = createReducer(
  ledEventTabInitialState,

  on(
    LedEventTabActions.fetchEventsSuccess,
    (state, { events }): LedEventTabFeatureState => ({ ...state, loading: false, events }),
  ),

  on(LedEventTabActions.fetchEventsFailure, (state): LedEventTabFeatureState => ({ ...state, loading: false })),

  on(LedOverviewActions.resetState, (): LedEventTabFeatureState => ledEventTabInitialState),
);

export const ledEventTabFeature = createFeature({
  name: LED_EVENT_TAB_FEATURE_KEY,
  reducer: ledEventTabReducer,
  extraSelectors: ({ selectEvents, selectLoading }) => ({
    selectViewModel: createSelector(
      selectEvents,
      selectLoading,
      (events, loading): ListViewModel<LedEventItem> => ({
        data: events,
        loading,
      }),
    ),
    selectLoaded: createSelector(selectEvents, (events) => !!events?.length),
  }),
});
