import { Pagination } from '@core/model';
import { createReducer, on, Action } from '@ngrx/store';
import { ChannelType } from '../../channel.model';

import * as ChannelTypesActions from './channel-types.actions';

export interface State {
  channelType: Pagination<ChannelType> | null;
  loading: boolean;
  loaded: boolean;
  error: string;
}

const initialState: State = {
  channelType: null,
  loading: false,
  loaded: false,
  error: '',
};

const channelTypesReducer = createReducer(
  initialState,
  on(
    ChannelTypesActions.getChannelTypes,
    (state): State => ({
      ...state,
      loading: true,
    }),
  ),
  on(
    ChannelTypesActions.getChannelTypesSuccess,
    (state, { payload }): State => ({
      ...state,
      channelType: payload,
      loading: false,
      loaded: true,
    }),
  ),
  on(
    ChannelTypesActions.getChannelTypesFailure,
    (state, { errorMsg }): State => ({
      ...state,
      loading: false,
      error: errorMsg,
    }),
  ),
);

// eslint-disable-next-line
export function reducer(state: State | undefined, action: Action) {
  return channelTypesReducer(state, action);
}
