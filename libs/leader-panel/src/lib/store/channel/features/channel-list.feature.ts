import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ListFilter, ListViewModel } from '../../../models/list';
import { ChannelListActions } from '../actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Channel } from '../../../models/channel';

export const CHANNELS_LIST_FEATURE_KEY = 'lpChannelsList';

export interface ChannelListFeatureState extends EntityState<Channel> {
  loading: boolean;
  filter: ListFilter;
  count: number;
}

const adapter: EntityAdapter<Channel> = createEntityAdapter<Channel>();

export const channelListInitialState: ChannelListFeatureState = adapter.getInitialState({
  loading: false,
  filter: { page: 1, per_page: 10 },
  count: null,
});

export const channelListReducer = createReducer(
  channelListInitialState,

  on(ChannelListActions.fetchChannels, (state): ChannelListFeatureState => ({ ...state, loading: true })),

  on(ChannelListActions.fetchChannelsSuccess, (state, { response }): ChannelListFeatureState => {
    return adapter.setAll(response.results, { ...state, loading: false, count: response.count });
  }),

  on(ChannelListActions.fetchChannelsFailure, (state): ChannelListFeatureState => ({ ...state, loading: false })),

  on(
    ChannelListActions.search,
    (state, { search }): ChannelListFeatureState => ({ ...state, filter: { ...state.filter, search, page: 1 } }),
  ),

  on(
    ChannelListActions.sort,
    (state, { sort }): ChannelListFeatureState => ({ ...state, filter: { ...state.filter, sort } }),
  ),

  on(
    ChannelListActions.setPagination,
    (state, { page, per_page }): ChannelListFeatureState => ({ ...state, filter: { ...state.filter, page, per_page } }),
  ),
);

export const channelListFeature = createFeature({
  name: CHANNELS_LIST_FEATURE_KEY,
  reducer: channelListReducer,
  extraSelectors: ({ selectLpChannelsListState, selectLoading, selectFilter, selectCount }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectLpChannelsListState).selectAll,
      selectLoading,
      selectFilter,
      selectCount,
      (channels, loading, filter, count): ListViewModel<Channel> => ({
        data: channels,
        loading,
        filter,
        count,
      }),
    ),
    selectLoaded: createSelector(adapter.getSelectors(selectLpChannelsListState).selectAll, (items) => !!items?.length),
  }),
});
