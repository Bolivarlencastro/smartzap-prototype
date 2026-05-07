import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { categoriesFeature } from '@app/shared/store/features';
import { ChannelPulseSideItem } from '../../models/channel';
import { ChannelsListParams, PulsesListParams } from '../../models/params';
import { PulseType } from '../../models/pulse';
import {
  FeedListViewModel,
  ChannelsFilterViewModel,
  FavoritePulsesViewModel,
  SideFiltersViewModel,
} from '../../models/view-models';
import * as FeedActions from './feed.actions';

export interface FeedFeatureState {
  isCurator: boolean;
  favoritePulses: ChannelPulseSideItem[];
  favoritePulsesLoading: boolean;
  channelsFilterCreatedByMe: ChannelPulseSideItem[];
  channelsFilterCreatedByMeLoading: boolean;
  channelsFilterSubscribed: ChannelPulseSideItem[];
  channelsFilterSubscribedLoading: boolean;
  selectedChannelId: string | null;
  pulseTypes: PulseType[];
  pulseTypesLoading: boolean;
  sideFilterGeneral: string | null;
  sideFilterLanguages: string[];
  sideFilterTypes: string[];
  sideFilterCategories: string[];
  selectedTab: 'feed' | 'channels';
  feedLayout: 'list' | 'grid';
}

export const feedInitialState: FeedFeatureState = {
  isCurator: false,
  favoritePulses: [],
  favoritePulsesLoading: true,
  channelsFilterCreatedByMe: [],
  channelsFilterCreatedByMeLoading: false,
  channelsFilterSubscribed: [],
  channelsFilterSubscribedLoading: true,
  selectedChannelId: null,
  pulseTypes: [],
  pulseTypesLoading: true,
  sideFilterGeneral: null,
  sideFilterLanguages: [],
  sideFilterTypes: [],
  sideFilterCategories: [],
  selectedTab: 'feed',
  feedLayout: 'list',
};

const feedReducer = createReducer(
  feedInitialState,
  on(
    FeedActions.init,
    (state, { isCurator }): FeedFeatureState => ({
      ...feedInitialState,
      isCurator,
      channelsFilterCreatedByMeLoading: isCurator,
    }),
  ),
  on(
    FeedActions.loadFavoritePulsesSuccess,
    (state, { favoritePulses }): FeedFeatureState => ({ ...state, favoritePulsesLoading: false, favoritePulses }),
  ),
  on(FeedActions.loadFavoritePulsesFailure, (state): FeedFeatureState => ({ ...state, favoritePulsesLoading: false })),
  on(
    FeedActions.addFavoritePulse,
    (state, { pulse }): FeedFeatureState => ({ ...state, favoritePulses: [pulse, ...state.favoritePulses] }),
  ),
  on(
    FeedActions.removeFavoritePulse,
    (state, { pulseId }): FeedFeatureState => ({
      ...state,
      favoritePulses: state.favoritePulses.filter((p) => p.id !== pulseId),
    }),
  ),
  on(
    FeedActions.reloadChannelsFilterCreatedByMe,
    (state): FeedFeatureState => ({ ...state, channelsFilterCreatedByMeLoading: true }),
  ),
  on(
    FeedActions.loadChannelsFilterCreatedByMeSuccess,
    (state, { items }): FeedFeatureState => ({
      ...state,
      channelsFilterCreatedByMeLoading: false,
      channelsFilterCreatedByMe: items,
    }),
  ),
  on(
    FeedActions.loadChannelsFilterCreatedByMeFailure,
    (state): FeedFeatureState => ({ ...state, channelsFilterCreatedByMeLoading: false }),
  ),
  on(
    FeedActions.loadChannelsFilterSubscribedSuccess,
    (state, { items }): FeedFeatureState => ({
      ...state,
      channelsFilterSubscribedLoading: false,
      channelsFilterSubscribed: items,
    }),
  ),
  on(
    FeedActions.loadChannelsFilterSubscribedFailure,
    (state): FeedFeatureState => ({ ...state, channelsFilterSubscribedLoading: false }),
  ),
  on(
    FeedActions.addSubscribedChannel,
    (state, { channel }): FeedFeatureState => ({
      ...state,
      channelsFilterSubscribed: [channel, ...state.channelsFilterSubscribed.filter((c) => c.id !== channel.id)],
    }),
  ),
  on(
    FeedActions.removeSubscribedChannel,
    (state, { channelId }): FeedFeatureState => ({
      ...state,
      channelsFilterSubscribed: state.channelsFilterSubscribed.filter((c) => c.id !== channelId),
    }),
  ),
  on(
    FeedActions.selectChannel,
    (state, { channelId }): FeedFeatureState => ({ ...state, selectedChannelId: channelId }),
  ),
  on(FeedActions.loadPulseTypes, (state): FeedFeatureState => ({ ...state, pulseTypesLoading: true })),
  on(
    FeedActions.loadPulseTypesSuccess,
    (state, { pulseTypes }): FeedFeatureState => ({ ...state, pulseTypesLoading: false, pulseTypes }),
  ),
  on(FeedActions.loadPulseTypesFailure, (state): FeedFeatureState => ({ ...state, pulseTypesLoading: false })),
  on(
    FeedActions.setSideFilters,
    (state, { general, languages, types, categories }): FeedFeatureState => ({
      ...state,
      ...(general !== undefined && { sideFilterGeneral: general }),
      ...(languages !== undefined && { sideFilterLanguages: languages }),
      ...(types !== undefined && { sideFilterTypes: types }),
      ...(categories !== undefined && { sideFilterCategories: categories }),
    }),
  ),
  on(
    FeedActions.clearSideFilters,
    (state): FeedFeatureState => ({
      ...state,
      sideFilterGeneral: null,
      sideFilterLanguages: [],
      sideFilterTypes: [],
      sideFilterCategories: [],
    }),
  ),
  on(
    FeedActions.setTab,
    (state, { tab }): FeedFeatureState => ({
      ...state,
      selectedTab: tab,
      selectedChannelId: null,
      sideFilterGeneral: null,
      sideFilterLanguages: [],
      sideFilterTypes: [],
      sideFilterCategories: [],
    }),
  ),
  on(FeedActions.setFeedLayout, (state, { layout }): FeedFeatureState => ({ ...state, feedLayout: layout })),
);

export const feedFeature = createFeature({
  name: 'pulsesFeed',
  reducer: feedReducer,
  extraSelectors: ({
    selectIsCurator,
    selectFavoritePulses,
    selectFavoritePulsesLoading,
    selectChannelsFilterCreatedByMe,
    selectChannelsFilterCreatedByMeLoading,
    selectChannelsFilterSubscribed,
    selectChannelsFilterSubscribedLoading,
    selectSelectedChannelId,
    selectPulseTypes,
    selectPulseTypesLoading,
    selectSideFilterGeneral,
    selectSideFilterLanguages,
    selectSideFilterTypes,
    selectSideFilterCategories,
    selectSelectedTab,
    selectFeedLayout,
  }) => ({
    selectChannelsFilterViewModel: createSelector(
      selectIsCurator,
      selectChannelsFilterCreatedByMe,
      selectChannelsFilterCreatedByMeLoading,
      selectChannelsFilterSubscribed,
      selectChannelsFilterSubscribedLoading,
      selectSelectedChannelId,
      selectSelectedTab,
      (
        isCurator,
        channelsFilterCreatedByMe,
        channelsFilterCreatedByMeLoading,
        channelsFilterSubscribed,
        channelsFilterSubscribedLoading,
        selectedChannelId,
        selectedTab,
      ): ChannelsFilterViewModel => ({
        isCurator,
        createdByMe: { loading: channelsFilterCreatedByMeLoading, items: channelsFilterCreatedByMe },
        subscribed: { loading: channelsFilterSubscribedLoading, items: channelsFilterSubscribed },
        selectedChannelId,
        selectedTab,
      }),
    ),
    selectFavoritePulsesViewModel: createSelector(
      selectFavoritePulses,
      selectFavoritePulsesLoading,
      (items, loading): FavoritePulsesViewModel => ({ loading, items }),
    ),
    selectSideFiltersViewModel: createSelector(
      selectIsCurator,
      selectPulseTypes,
      selectPulseTypesLoading,
      selectSideFilterGeneral,
      selectSideFilterLanguages,
      selectSideFilterTypes,
      selectSideFilterCategories,
      categoriesFeature.selectChannels,
      selectSelectedTab,
      (
        isCurator,
        pulseTypes,
        pulseTypesLoading,
        sideFilterGeneral,
        sideFilterLanguages,
        sideFilterTypes,
        sideFilterCategories,
        channels,
        selectedTab,
      ): SideFiltersViewModel => ({
        loading: pulseTypesLoading,
        selectedTab,
        generalOptions:
          selectedTab === 'feed'
            ? [{ id: 'favorites', name: 'PULSES_FEED.SIDE_FILTERS.GENERAL.FAVORITES' }]
            : [
                ...(isCurator ? [{ id: 'created_by_me', name: 'PULSES_FEED.SIDE_FILTERS.GENERAL.CREATED_BY_ME' }] : []),
                { id: 'subscribed', name: 'PULSES_FEED.SIDE_FILTERS.GENERAL.SUBSCRIBED' },
              ],
        languageOptions: [
          { id: 'pt-BR', name: 'PULSES_FEED.SIDE_FILTERS.LANGUAGE.PT_BR' },
          { id: 'pt-PT', name: 'PULSES_FEED.SIDE_FILTERS.LANGUAGE.PT_PT' },
          { id: 'en', name: 'PULSES_FEED.SIDE_FILTERS.LANGUAGE.EN' },
          { id: 'es', name: 'PULSES_FEED.SIDE_FILTERS.LANGUAGE.ES' },
        ],
        typeOptions: pulseTypes,
        categoryOptions: channels?.map((c) => ({ id: c.id ?? '', name: c.name ?? '' }))?.filter((c) => c.id),
        selectedGeneral: sideFilterGeneral,
        selectedLanguages: sideFilterLanguages,
        selectedTypes: sideFilterTypes,
        selectedCategories: sideFilterCategories,
      }),
    ),
    selectFeedListViewModel: createSelector(
      selectSelectedTab,
      selectFeedLayout,
      (selectedTab, feedLayout): FeedListViewModel => ({ selectedTab, feedLayout }),
    ),
    selectActivePulsesListParams: createSelector(
      selectSelectedChannelId,
      selectSideFilterGeneral,
      selectSideFilterLanguages,
      selectSideFilterTypes,
      selectSideFilterCategories,
      selectSelectedTab,
      (channelId, general, languages, types, categories, tab): Partial<PulsesListParams> => ({
        ...(tab === 'feed' && channelId ? { channel_id: channelId } : {}),
        ...(general === 'favorites' ? { bookmarked: true } : {}),
        ...(languages.length ? { language: languages } : {}),
        ...(types.length ? { pulse_type: types } : {}),
        ...(categories.length ? { channel_category: categories } : {}),
      }),
    ),
    selectActiveChannelsListParams: createSelector(
      selectSideFilterGeneral,
      selectSideFilterLanguages,
      selectSideFilterCategories,
      (general, languages, categories): Partial<ChannelsListParams> => ({
        ...(general === 'created_by_me' ? { managed: true } : {}),
        ...(general === 'subscribed' ? { subscribed: true } : {}),
        ...(languages.length ? { language: languages } : {}),
        ...(categories.length ? { channel_category: categories } : {}),
      }),
    ),
    selectHasSelectedFilter: createSelector(
      selectSelectedChannelId,
      selectSideFilterGeneral,
      selectSideFilterLanguages,
      selectSideFilterTypes,
      selectSideFilterCategories,
      selectSelectedTab,
      (channelId, general, languages, types, categories, tab): boolean =>
        (tab === 'feed' && !!channelId) ||
        general !== null ||
        languages?.length > 0 ||
        types?.length > 0 ||
        categories?.length > 0,
    ),
  }),
});
