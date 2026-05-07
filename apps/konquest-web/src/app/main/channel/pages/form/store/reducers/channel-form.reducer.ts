import { createReducer, on, Action } from '@ngrx/store';

import { ChannelFormActions } from '../actions';
import { Channel } from '../../../../channel.model';

export interface State {
  channel: Channel | undefined;
  loading: boolean;
  loaded: boolean;
  error: string;
  submitted: boolean;
}

export const initialState: State = {
  channel: undefined,
  loading: false,
  loaded: false,
  submitted: false,
  error: '',
};

const getChannelReducer = createReducer(
  initialState,
  on(
    ChannelFormActions.submit,
    (state): State => ({
      ...state,
      loading: true,
      loaded: false,
      submitted: true,
    }),
  ),
  on(
    ChannelFormActions.submitSuccess,
    (state, { channel }): State => ({
      ...state,
      channel,
      loading: false,
      loaded: true,
    }),
  ),
  on(
    ChannelFormActions.getChannel,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    ChannelFormActions.getChannelSuccess,
    (state, { channel }): State => ({
      ...state,
      channel,
      loading: false,
      loaded: true,
    }),
  ),
  on(
    ChannelFormActions.getChannelFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),
  on(ChannelFormActions.getChannelReset, (): State => initialState),
);

// eslint-disable-next-line
export function getReducer(state: State | undefined, action: Action) {
  return getChannelReducer(state, action);
}
