import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LedPulseItem } from '../../../models/led-pulse-item';
import { ListViewModel } from '../../../models/list';
import { LedOverviewActions, LedPulseTabActions } from '../actions';

export const LED_PULSE_TAB_FEATURE_KEY = 'lpLedPulseTab';

export interface LedPulseTabFeatureState {
  loading: boolean;
  pulses: LedPulseItem[];
}

export const ledPulseTabInitialState: LedPulseTabFeatureState = {
  loading: true,
  pulses: [],
};

export const ledPulseTabReducer = createReducer(
  ledPulseTabInitialState,

  on(
    LedPulseTabActions.fetchPulsesSuccess,
    (state, { pulses }): LedPulseTabFeatureState => ({ ...state, loading: false, pulses }),
  ),

  on(LedPulseTabActions.fetchPulsesFailure, (state): LedPulseTabFeatureState => ({ ...state, loading: false })),

  on(LedOverviewActions.resetState, (): LedPulseTabFeatureState => ledPulseTabInitialState),
);

export const ledPulseTabFeature = createFeature({
  name: LED_PULSE_TAB_FEATURE_KEY,
  reducer: ledPulseTabReducer,
  extraSelectors: ({ selectPulses, selectLoading }) => ({
    selectViewModel: createSelector(
      selectPulses,
      selectLoading,
      (pulses, loading): ListViewModel<LedPulseItem> => ({
        data: pulses,
        loading,
      }),
    ),
    selectLoaded: createSelector(selectPulses, (pulses) => !!pulses?.length),
  }),
});
