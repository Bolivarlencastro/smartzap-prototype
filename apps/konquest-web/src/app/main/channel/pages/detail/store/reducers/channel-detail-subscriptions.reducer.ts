import { createReducer, on } from '@ngrx/store';

import { ChannelDetailSubscriptionsActions } from '../actions';
import { ChannelSubscription } from '../../../../channel.model';

export interface State {
  channelSubscriptions: ChannelSubscription | null;
  loading: boolean;
  loaded: boolean;
  error: string;
}

const initialState: State = {
  channelSubscriptions: null,
  loading: false,
  loaded: false,
  error: '',
};

export const reducers = createReducer(
  initialState,
  on(
    ChannelDetailSubscriptionsActions.postChannelSubscriptions,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    ChannelDetailSubscriptionsActions.postChannelSubscriptionsSuccess,
    (state, { payload: channelSubscriptions }): State => ({
      ...state,
      channelSubscriptions,
      loading: false,
      loaded: true,
    }),
  ),
  on(
    ChannelDetailSubscriptionsActions.postChannelSubscriptionsFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),
);
