import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Channel } from '../../../models/channel';
import { ChannelDialogData, ChannelDialogViewModel } from '../../../models/channel-dialog';
import { ChannelDialogActions } from '../actions';

export interface ChannelDialogFeatureState {
  selectedChannel: Channel;
  loading: boolean;
  data: ChannelDialogData;
}

export const channelDialogInitialState: ChannelDialogFeatureState = {
  selectedChannel: null,
  loading: true,
  data: null,
};

const reducer = createReducer(
  channelDialogInitialState,

  on(
    ChannelDialogActions.openDialog,
    (state, { selectedChannel }): ChannelDialogFeatureState => ({ ...state, selectedChannel }),
  ),

  on(
    ChannelDialogActions.fetchDataSuccess,
    (state, { data }): ChannelDialogFeatureState => ({ ...state, loading: false, data }),
  ),

  on(ChannelDialogActions.fetchDataFailure, (state): ChannelDialogFeatureState => ({ ...state, loading: false })),

  on(ChannelDialogActions.resetState, (): ChannelDialogFeatureState => channelDialogInitialState),
);

export const channelDialogFeature = createFeature({
  name: 'channel-dialog',
  reducer,
  extraSelectors: ({ selectSelectedChannel, selectLoading, selectData }) => ({
    selectChannelId: createSelector(selectSelectedChannel, (channel): string => channel.id),
    selectViewModel: createSelector(
      selectSelectedChannel,
      selectLoading,
      selectData,
      (channel, loading, data): ChannelDialogViewModel => ({
        channel,
        loading,
        data,
      }),
    ),
  }),
});
