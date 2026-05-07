import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LedChannelItem } from '../../../models/led-channel-item';
import { ListViewModel } from '../../../models/list';
import { LedChannelTabActions, LedOverviewActions } from '../actions';

export const LED_CHANNEL_TAB_FEATURE_KEY = 'lpLedChannelTab';

export interface LedChannelTabFeatureState {
  loading: boolean;
  channels: LedChannelItem[];
}

export const ledChannelTabInitialState: LedChannelTabFeatureState = {
  loading: true,
  channels: [],
};

export const ledChannelTabReducer = createReducer(
  ledChannelTabInitialState,

  on(
    LedChannelTabActions.fetchChannelsSuccess,
    (state, { channels }): LedChannelTabFeatureState => ({ ...state, loading: false, channels }),
  ),

  on(LedChannelTabActions.fetchChannelsFailure, (state): LedChannelTabFeatureState => ({ ...state, loading: false })),

  on(LedOverviewActions.resetState, (): LedChannelTabFeatureState => ledChannelTabInitialState),
);

export const ledChannelTabFeature = createFeature({
  name: LED_CHANNEL_TAB_FEATURE_KEY,
  reducer: ledChannelTabReducer,
  extraSelectors: ({ selectChannels, selectLoading }) => ({
    selectViewModel: createSelector(
      selectChannels,
      selectLoading,
      (channels, loading): ListViewModel<LedChannelItem> => ({
        data: channels,
        loading,
      }),
    ),
    selectLoaded: createSelector(selectChannels, (channels) => !!channels?.length),
  }),
});
