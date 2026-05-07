import { createReducer, on } from '@ngrx/store';

import { ChannelDetailRatingsActions } from '../actions';
import { ChannelRating } from '../../../../channel.model';

export interface State {
  channelRating: ChannelRating | null;
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const initialState: State = {
  channelRating: null,
  loading: false,
  loaded: false,
  error: '',
};

export const reducers = createReducer(
  initialState,
  on(
    ChannelDetailRatingsActions.postChannelRatings,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    ChannelDetailRatingsActions.postChannelRatingsSuccess,
    (state, { payload }): State => ({
      ...state,
      channelRating: payload,
      loading: false,
      loaded: true,
    }),
  ),
  on(
    ChannelDetailRatingsActions.postChannelRatingsFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),
);
