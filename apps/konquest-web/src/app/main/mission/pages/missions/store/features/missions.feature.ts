import { MissionProvider, MissionScreenType, MissionsFilter } from '@app/main/mission/mission.model';
import { ModalFilterItem, QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { categoriesFeature, LearnContentActions } from 'app/shared/store';
import { toggleBookmarkAction, updateLearnContentBookmarkInGroup } from 'app/shared/utils/card-helpers';
import { MissionsActions } from '../actions';

export interface MissionsFeatureState extends EntityState<LearnContentCardData> {
  screenType: MissionScreenType;
  missionsLoading: boolean;
  recommendationsLoading: boolean;
  recommendations: LearnContentCardData[];
  providers: MissionProvider[];
  filter: MissionsFilter;
  finished: boolean;
}

export const adapter = createEntityAdapter<LearnContentCardData>({ selectId: (item) => item.contentId });

export const missionsInitialState: MissionsFeatureState = adapter.getInitialState({
  screenType: null,
  missionsLoading: true,
  recommendationsLoading: true,
  recommendations: null,
  providers: [],
  filter: {
    page: 1,
    per_page: 15,
    type: QuickFilterType.HOME,
  },
  finished: false,
});

export const missionsReducer = createReducer(
  missionsInitialState,

  on(
    MissionsActions.init,
    (state, { screenType }): MissionsFeatureState => ({
      ...state,
      screenType,
    }),
  ),

  on(
    MissionsActions.loadMissions,
    (state): MissionsFeatureState =>
      adapter.removeAll({ ...state, missionsLoading: true, filter: { ...state.filter, page: 1 } }),
  ),

  on(
    MissionsActions.loadMissionsSuccess,
    (state, { missions, finished }): MissionsFeatureState =>
      adapter.setAll(missions, {
        ...state,
        missionsLoading: false,
        finished,
      }),
  ),

  on(MissionsActions.loadMissionsFailure, (state): MissionsFeatureState => ({ ...state, missionsLoading: false })),

  on(
    MissionsActions.loadRecommendationsSuccess,
    (state, { recommendations }): MissionsFeatureState => ({
      ...state,
      recommendationsLoading: false,
      recommendations,
    }),
  ),

  on(
    MissionsActions.loadRecommendationsFailure,
    (state): MissionsFeatureState => ({ ...state, recommendationsLoading: false }),
  ),

  on(
    MissionsActions.loadMissionProvidersSuccess,
    (state, { providers }): MissionsFeatureState => ({ ...state, providers }),
  ),

  on(
    MissionsActions.cleanFilter,
    (state): MissionsFeatureState => ({
      ...state,
      filter: {
        ...state.filter,
        languages: null,
        providers: null,
      },
    }),
  ),

  on(
    MissionsActions.filter,
    (state, { filter }): MissionsFeatureState => ({ ...state, filter: { ...state.filter, ...filter } }),
  ),

  on(LearnContentActions.addBookmarkSuccess, (state, { learnContent, bookmarkId }): MissionsFeatureState => {
    const updatedLearnContent: LearnContentCardData = {
      ...learnContent,
      bookmarkId,
      actions: toggleBookmarkAction(learnContent.actions, 'add-bookmark', 'remove-bookmark'),
    };

    return adapter.updateOne(
      {
        id: learnContent.contentId,
        changes: {
          bookmarkId,
          actions: toggleBookmarkAction(learnContent.actions, 'add-bookmark', 'remove-bookmark'),
        },
      },
      { ...state, recommendations: updateLearnContentBookmarkInGroup(state.recommendations, updatedLearnContent) },
    );
  }),

  on(LearnContentActions.removeBookmarkSuccess, (state, { learnContent }): MissionsFeatureState => {
    const updatedLearnContent: LearnContentCardData = {
      ...learnContent,
      bookmarkId: undefined,
      actions: toggleBookmarkAction(learnContent.actions, 'remove-bookmark', 'add-bookmark'),
    };

    return adapter.updateOne(
      {
        id: learnContent.contentId,
        changes: {
          bookmarkId: undefined,
          actions: toggleBookmarkAction(learnContent.actions, 'remove-bookmark', 'add-bookmark'),
        },
      },
      { ...state, recommendations: updateLearnContentBookmarkInGroup(state.recommendations, updatedLearnContent) },
    );
  }),

  on(MissionsActions.loadMoreMissions, (state): MissionsFeatureState => {
    if (state.finished) {
      return state;
    }

    return { ...state, missionsLoading: true, filter: { ...state.filter, page: state.filter.page + 1 } };
  }),

  on(
    MissionsActions.loadMoreMissionsSuccess,
    (state, { missions, finished }): MissionsFeatureState =>
      adapter.addMany(missions, {
        ...state,
        missionsLoading: false,
        finished,
      }),
  ),

  on(MissionsActions.resetState, (): MissionsFeatureState => missionsInitialState),
);

export const missionsFeature = createFeature({
  name: 'missions',
  reducer: missionsReducer,
  extraSelectors: ({ selectMissionsState, selectScreenType, selectProviders, selectFilter }) => ({
    selectCourses: createSelector(
      adapter.getSelectors(selectMissionsState).selectAll,
      (missions): LearnContentCardData[] => missions,
    ),

    selectBuiltCategories: createSelector(
      categoriesFeature.selectMissionsFiltered,
      selectFilter,
      (categories, filter): ModalFilterItem[] => {
        const categoryFilter = filter.categories || [];
        return categories.map((category) => ({ ...category, checked: categoryFilter.includes(category.id) }));
      },
    ),

    selectBuiltProviders: createSelector(selectProviders, selectFilter, (providers, filter): ModalFilterItem[] => {
      const providerFilter = filter.providers || [];
      return providers.map((provider) => ({ ...provider, checked: providerFilter.includes(provider.id) }));
    }),

    selectFilterLanguages: createSelector(selectFilter, (filter) => filter?.languages || []),

    selectEmptyMessage: createSelector(selectFilter, (filter): string => {
      const map = new Map<QuickFilterType, string>([
        [QuickFilterType.MINE, 'MISSIONS.YOU_DONT_STILL_CREATED'],
        [QuickFilterType.MY_LIST, 'MISSIONS.NOT_EXIST_MISSIONS'],
        [QuickFilterType.HOME, 'MISSIONS.NOT_EXIST_MISSIONS'],
      ]);
      return map.get(filter.type);
    }),

    selectShouldDisplayBanner: createSelector(
      selectScreenType,
      selectFilter,
      (screenType, filter): boolean =>
        screenType === 'missions' && filter.type === QuickFilterType.HOME && !filter.search,
    ),
  }),
});
