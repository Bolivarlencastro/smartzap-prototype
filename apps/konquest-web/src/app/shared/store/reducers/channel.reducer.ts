import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Channel } from 'app/main/channel/channel.model';
import { ChannelActions } from '../actions';

export const featureKey = 'channelCache';

export interface State extends EntityState<Channel> {
  isLoading: boolean;
  page: number;
  total: number;
}

export const adapter: EntityAdapter<Channel> = createEntityAdapter<Channel>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  page: 1,
  total: 0,
});

const channelReducer = createReducer(
  initialState,

  on(ChannelActions.filterChannels, ChannelActions.clearCache, (): State => ({ ...initialState })),

  on(
    ChannelActions.loadChannels,
    (state): State => ({
      ...state,
      isLoading: true,
      page: state.page + 1,
    }),
  ),

  on(
    ChannelActions.loadChannelsFailure,
    (state): State => ({
      ...state,
      isLoading: false,
      total: 0,
    }),
  ),

  on(
    ChannelActions.loadChannelsSuccess,
    (state, { channels }): State =>
      adapter.addMany(channels.results ? channels.results : [], {
        ...state,
        isLoading: false,
        total: channels.count ? channels.count : 0,
      }),
  ),
);

export function reducer(state: State | undefined, action: Action): any {
  return channelReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
