import {
  AREA_RANKING,
  DIRECTOR_RANKING,
  GamificationSubModule,
  LEADER_RANKING,
  MANAGER_RANKING,
  RankingTab,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { GamificationActions } from '../actions';

export interface GamificationFeatureState {
  subModules: GamificationSubModule[];
  isLoading: boolean;
  hasAdminPermission: boolean;
}

export const gamificationInitialState: GamificationFeatureState = {
  subModules: null,
  isLoading: false,
  hasAdminPermission: false,
};

export const gamificationReducer = createReducer(
  gamificationInitialState,

  on(
    GamificationActions.loadSubModules,
    (state): GamificationFeatureState => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    GamificationActions.loadSubModulesSuccess,
    (state, { subModules }): GamificationFeatureState => ({
      ...state,
      subModules,
      isLoading: false,
    }),
  ),

  on(
    GamificationActions.setAdminPermission,
    (state, { hasAdminPermission }): GamificationFeatureState => ({
      ...state,
      hasAdminPermission,
    }),
  ),

  on(GamificationActions.resetState, (): GamificationFeatureState => gamificationInitialState),
);

export const gamificationFeature = createFeature({
  name: 'gamification',
  reducer: gamificationReducer,
  extraSelectors: ({ selectSubModules, selectHasAdminPermission }) => ({
    selectTabs: createSelector(
      selectSubModules,
      selectHasAdminPermission,
      (subModules, hasAdminPermission): RankingTab[] => {
        const tabs: RankingTab[] = [
          {
            label: marker('GAMIFICATION.RANKING_TABS.GENERAL'),
            path: 'general',
          },
        ];

        if (hasAdminPermission) {
          const map = new Map<string, RankingTab>([
            [
              DIRECTOR_RANKING,
              {
                label: marker('GAMIFICATION.RANKING_TABS.DIRECTORATES'),
                path: 'directorates',
              },
            ],
            [
              MANAGER_RANKING,
              {
                label: marker('GAMIFICATION.RANKING_TABS.SUB_DIRECTORATES'),
                path: 'subdirectorates',
              },
            ],
            [
              AREA_RANKING,
              {
                label: marker('GAMIFICATION.RANKING_TABS.AREA'),
                path: 'area',
              },
            ],
            [
              LEADER_RANKING,
              {
                label: marker('GAMIFICATION.RANKING_TABS.LEADERSHIP'),
                path: 'leadership',
              },
            ],
          ]);

          map.forEach((value, key) => {
            const module = subModules?.find((module) => module.ranking === key);
            if (module && module.status) {
              tabs.push(value);
            }
          });
        }

        return tabs;
      },
    ),
  }),
});
