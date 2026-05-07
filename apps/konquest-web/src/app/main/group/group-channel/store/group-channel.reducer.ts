import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as GroupChannelActions from '../store/group-channel.actions';
import { GroupChannel } from '../group-channel.model';

export const groupChannelsFeatureKey = 'groupChannels';

export interface State extends EntityState<GroupChannel> {
  isLoading: boolean;
  page: number;
  per_page: number;
  total: number;
}

export const adapter: EntityAdapter<GroupChannel> = createEntityAdapter<GroupChannel>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  page: 1,
  per_page: 10,
  total: 0,
});

const groupChannelReducer = createReducer(
  initialState,
  on(GroupChannelActions.deleteGroupChannel, (state, action): State => adapter.removeOne(action.id, state)),
  on(
    GroupChannelActions.loadGroupChannels,
    (state): State => ({
      ...state,
      isLoading: true,
    }),
  ),
  on(
    GroupChannelActions.filterGroupChannels,
    (state, { queryParams }): State => ({
      ...initialState,
      page: queryParams?.page ?? 1,
      per_page: queryParams?.per_page ?? state.per_page,
      isLoading: true,
    }),
  ),
  on(
    GroupChannelActions.loadGroupChannelsSuccess,
    (state, { data }): State =>
      adapter.setAll(data.results, {
        ...state,
        total: data.count,
        isLoading: false,
      }),
  ),
  on(
    GroupChannelActions.loadGroupChannelsFailure,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),
  on(GroupChannelActions.clearCache, (): State => ({ ...initialState })),
);

export function reducer(state: State | undefined, action: Action): any {
  return groupChannelReducer(state, action);
}

export const { selectEntities, selectAll, selectTotal } = adapter.getSelectors();
