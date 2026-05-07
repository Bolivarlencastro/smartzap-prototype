import { createReducer, on } from '@ngrx/store';

import { ChannelDetailActions } from '../actions';
import { Channel, ChannelSubscription } from '../../../../channel.model';
import { ContributorDialogActions } from 'app/shared/components/contributors-dialog/store';

export interface State {
  channel: Channel | null;
  subscribers: ChannelSubscription[];
  loading: boolean;
  loadingSubscribers: boolean;
  loaded: boolean;
  error: string;
}

export const initialState: State = {
  channel: null,
  subscribers: [],
  loadingSubscribers: false,
  loading: false,
  loaded: false,
  error: '',
};

export const reducers = createReducer(
  initialState,
  on(
    ChannelDetailActions.getChannel,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    ChannelDetailActions.getChannelSuccess,
    (state, { channel }): State => ({
      ...state,
      channel,
      loading: false,
      loaded: true,
    }),
  ),
  on(
    ChannelDetailActions.updateChannelRating,
    (state, { rating }): State => ({
      ...state,
      channel: state.channel ? { ...state.channel, rating_avg: rating } : null,
      loading: false,
      loaded: true,
    }),
  ),
  on(
    ChannelDetailActions.getChannelFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),

  on(
    ChannelDetailActions.getChannelSubscribers,
    (state): State => ({
      ...state,
      loadingSubscribers: true,
    }),
  ),
  on(
    ChannelDetailActions.getChannelSubscribersSuccess,
    (state, { subscribers }): State => ({
      ...state,
      subscribers,
      loadingSubscribers: false,
    }),
  ),

  on(
    ChannelDetailActions.getChannelSubscribersFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loadingSubscribers: false,
      error: errorMsg,
    }),
  ),

  on(ChannelDetailActions.updateChannelSubscription, (state, { channel, subscription }): State => {
    const enrolled = !!subscription;
    const subscribers = state.channel.channel_statistics.total_subscribers;
    const total_subscribers = enrolled ? subscribers + 1 : subscribers - 1;
    return {
      ...state,
      channel: { ...channel, enrolled, channel_statistics: { ...channel.channel_statistics, total_subscribers } },
    };
  }),

  on(ContributorDialogActions.addContributorSuccess, (state, { contributor }): State => {
    if (!state.channel) {
      return state;
    }

    const updatedChannel: Channel = structuredClone(state.channel);
    updatedChannel.contributors = [contributor.user, ...updatedChannel.contributors];
    return { ...state, channel: updatedChannel };
  }),

  on(ContributorDialogActions.removeContributorSuccess, (state, { userId }): State => {
    if (!state.channel) {
      return state;
    }

    const updatedChannel: Channel = structuredClone(state.channel);
    updatedChannel.contributors = updatedChannel.contributors.filter((contributor) => contributor.id !== userId);
    return { ...state, channel: updatedChannel };
  }),

  on(ChannelDetailActions.updateChannelDescriptionSuccess, (state, { description }): State => {
    if (!state.channel) {
      return state;
    }
    const updatedChannel: Channel = structuredClone(state.channel);
    updatedChannel.description = description;
    return { ...state, channel: updatedChannel };
  }),

  on(ChannelDetailActions.resetState, (): State => initialState),
);

export interface DeleteState {
  loading: boolean;
  loaded: boolean;
  error: string;
}

const deleteInitialState: DeleteState = {
  loading: false,
  loaded: false,
  error: '',
};

export const deleteReducers = createReducer(
  deleteInitialState,
  on(
    ChannelDetailActions.deleteChannel,
    (state): DeleteState => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    ChannelDetailActions.deleteChannelSuccess,
    (state): DeleteState => ({
      ...state,
      loading: false,
      loaded: true,
    }),
  ),
  on(
    ChannelDetailActions.deleteChannelFailure,
    (state, { errorMsg }): DeleteState => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),
);
