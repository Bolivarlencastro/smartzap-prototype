import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ChannelsListParams } from '../../models/params';
import { ChannelsListViewModel } from '../../models/view-models';
import * as FeedActions from '../feed/feed.actions';
import * as ChannelsListActions from './channels-list.actions';

export interface ChannelsListFeatureState extends EntityState<KpChannelCardModel> {
  loading: boolean;
  loadingMore: boolean;
  finished: boolean;
  filter: ChannelsListParams;
}

export const channelsListAdapter: EntityAdapter<KpChannelCardModel> = createEntityAdapter<KpChannelCardModel>();

export const channelsListInitialState: ChannelsListFeatureState = channelsListAdapter.getInitialState({
  loading: false,
  loadingMore: false,
  finished: false,
  filter: { page: 1, per_page: 20, active: true },
});

const channelsListReducer = createReducer(
  channelsListInitialState,

  on(FeedActions.init, (): ChannelsListFeatureState => channelsListInitialState),

  on(ChannelsListActions.loadChannels, (): ChannelsListFeatureState => {
    return channelsListAdapter.removeAll({ ...channelsListInitialState, loading: true });
  }),

  on(ChannelsListActions.loadChannelsSuccess, (state, { payload }): ChannelsListFeatureState => {
    const { items, last_page, page } = payload;
    return channelsListAdapter.setAll(items || [], {
      ...state,
      loading: false,
      finished: page === last_page,
    });
  }),

  on(
    ChannelsListActions.fetchMoreChannels,
    (state): ChannelsListFeatureState => ({ ...state, loadingMore: !state.finished }),
  ),

  on(ChannelsListActions.fetchMoreChannelsSuccess, (state, { payload }): ChannelsListFeatureState => {
    const { response, updatedFilter } = payload;
    const { items, page, last_page } = response;
    return channelsListAdapter.addMany(items || [], {
      ...state,
      loadingMore: false,
      finished: page === last_page,
      filter: updatedFilter,
    });
  }),

  on(
    ChannelsListActions.loadChannelsFailure,
    ChannelsListActions.fetchMoreChannelsFailure,
    (state): ChannelsListFeatureState => ({
      ...state,
      loading: false,
      loadingMore: false,
    }),
  ),

  on(ChannelsListActions.toggleSubscription, (state, { channelId, subscriptionId }): ChannelsListFeatureState => {
    const channel = state.entities[channelId];
    if (!channel) return state;
    return channelsListAdapter.updateOne(
      { id: channelId, changes: { subscription_id: subscriptionId ? '' : `sub-optimistic-${channelId}` } },
      state,
    );
  }),

  on(
    ChannelsListActions.toggleSubscriptionSuccess,
    (state, { channelId, subscriptionId }): ChannelsListFeatureState => {
      return channelsListAdapter.updateOne(
        { id: channelId, changes: { subscription_id: subscriptionId ?? '' } },
        state,
      );
    },
  ),

  on(
    ChannelsListActions.toggleSubscriptionFailure,
    (state, { channelId, originalSubscriptionId }): ChannelsListFeatureState => {
      return channelsListAdapter.updateOne(
        { id: channelId, changes: { subscription_id: originalSubscriptionId } },
        state,
      );
    },
  ),
);

export const channelsListFeature = createFeature({
  name: 'channelsList',
  reducer: channelsListReducer,
  extraSelectors: ({ selectChannelsListState, selectLoading, selectLoadingMore }) => {
    const { selectAll } = channelsListAdapter.getSelectors(selectChannelsListState);
    return {
      selectAll,
      selectChannelsListViewModel: createSelector(
        selectAll,
        selectLoading,
        selectLoadingMore,
        (channels, loading, loadingMore): ChannelsListViewModel => ({ channels, loading, loadingMore }),
      ),
    };
  },
});
