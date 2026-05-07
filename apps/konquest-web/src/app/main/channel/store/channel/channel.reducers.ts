import { createReducer, on, Action } from '@ngrx/store';

import * as ChannelActions from './channel.actions';
import { Channel } from '../../channel.model';

export interface State {
  channel: Channel | null;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: State = {
  channel: null,
  loading: false,
  success: false,
  error: '',
};

const channelReducer = createReducer(
  initialState,
  on(
    ChannelActions.putChannel,
    ChannelActions.postChannel,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    ChannelActions.putChannelSuccess,
    ChannelActions.postChannelSuccess,
    (state, { channel }): State => ({
      ...state,
      channel,
      loading: false,
      success: true,
    }),
  ),
  on(
    ChannelActions.putChannelFailure,
    ChannelActions.postChannelFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),
  on(ChannelActions.putChannelReset, (): State => initialState),
);

// eslint-disable-next-line
export function reducer(state: State | undefined, action: Action) {
  return channelReducer(state, action);
}
