import {
  AREA_RANKING,
  DIRECTOR_RANKING,
  GamificationItem,
  GamificationListDto,
  GamificationStatistics,
  GamificationSubModule,
  LEADER_RANKING,
  MANAGER_RANKING,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { BuildedStatistic } from '@keeps-platform-frontend-workspace/ui/kp-personal-score-menu';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { GamificationActions } from '../actions';

export const GAMIFICATION_FEATURE_KEY = 'gamificationFeature';

export interface GamificationFeatureState {
  gamification: Partial<GamificationItem>;
  subModules: GamificationSubModule[];
  partialRanking: Partial<GamificationListDto>[];
  statistics: GamificationStatistics;
  isLoadingMenu: boolean;
  personalScore: number;
}

export const gamificationInitialState: GamificationFeatureState = {
  gamification: null,
  subModules: null,
  partialRanking: null,
  statistics: null,
  isLoadingMenu: false,
  personalScore: null,
};

const reducer = createReducer(
  gamificationInitialState,

  on(
    GamificationActions.loadGamificationSuccess,
    (state, { data }): GamificationFeatureState => ({ ...state, ...data }),
  ),

  on(
    GamificationActions.updateGamificationSubModulesSuccess,
    (state, { data }): GamificationFeatureState => ({
      ...state,
      subModules: state.subModules.map((module) => (module.id === data.id ? data : module)),
    }),
  ),

  on(
    GamificationActions.loadGamificationMenu,
    (state): GamificationFeatureState => ({ ...state, isLoadingMenu: true }),
  ),

  on(
    GamificationActions.loadGamificationMenuSuccess,
    (state, { data }): GamificationFeatureState => ({ ...state, ...data, isLoadingMenu: false }),
  ),

  on(
    GamificationActions.loadPersonalScoreSuccess,
    (state, { personalScore }): GamificationFeatureState => ({ ...state, personalScore }),
  ),
);

export const gamificationFeature = createFeature({
  name: GAMIFICATION_FEATURE_KEY,
  reducer,
  extraSelectors: ({ selectGamification, selectSubModules, selectStatistics, selectPersonalScore }) => ({
    selectIsGamificationActive: createSelector(selectGamification, (data) => data?.status),
    selectGamificationSubModules: createSelector(selectSubModules, (subModules): Partial<GamificationItem>[] => {
      const items: Partial<GamificationItem>[] = [
        {
          status: true,
          can_enable: false,
          field: 'ranking_general',
          label: marker('GAMIFICATION.TOGGLE.LABEL.GENERAL_RANKING'),
          tooltip: marker('GAMIFICATION.TOGGLE.TOOLTIP.GENERAL_RANKING'),
        },
      ];

      const map = new Map<string, Partial<GamificationItem>>([
        [
          DIRECTOR_RANKING,
          {
            field: 'ranking_director',
            label: marker('GAMIFICATION.TOGGLE.LABEL.RANKING_BY_BOARD'),
            tooltip: marker('GAMIFICATION.TOGGLE.TOOLTIP.RANKING_BY_BOARD'),
          },
        ],
        [
          MANAGER_RANKING,
          {
            field: 'ranking_manager',
            label: marker('GAMIFICATION.TOGGLE.LABEL.RANKING_BY_SUB_DIRECTORATE'),
            tooltip: marker('GAMIFICATION.TOGGLE.TOOLTIP.RANKING_BY_SUB_DIRECTORATE'),
          },
        ],
        [
          AREA_RANKING,
          {
            field: 'ranking_activity_area',
            label: marker('GAMIFICATION.TOGGLE.LABEL.RANKING_BY_AREA'),
            tooltip: marker('GAMIFICATION.TOGGLE.TOOLTIP.RANKING_BY_AREA'),
          },
        ],
        [
          LEADER_RANKING,
          {
            field: 'ranking_leader',
            label: marker('GAMIFICATION.TOGGLE.LABEL.RANKING_BY_LEADERSHIP'),
            tooltip: marker('GAMIFICATION.TOGGLE.TOOLTIP.RANKING_BY_LEADERSHIP'),
          },
        ],
        // [
        //   MULTIPLIER_RANKING,
        //   {
        //     field: 'ranking_multiplier',
        //     label: marker('GAMIFICATION.TOGGLE.LABEL.MULTIPLIER_RANKING'),
        //   },
        // ],
      ]);

      map.forEach((value, key) => {
        const module = subModules?.find((module) => module.ranking === key);
        if (module) {
          items.push({ ...module, ...value });
        }
      });

      return items;
    }),
    selectBuildedStatistics: createSelector(
      selectStatistics,
      selectPersonalScore,
      (data, score): BuildedStatistic[] => {
        const statistics: BuildedStatistic[] = [
          {
            label: 'UI.GAMIFICATION.PERSONAL_SCORE.STATISTICS_TAB.LEARNING_TRAILS',
            value: data?.completed_trails,
            svgIcon: 'learning-trail',
            pluralize: true,
          },
          {
            label: 'UI.GAMIFICATION.PERSONAL_SCORE.STATISTICS_TAB.MISSIONS',
            value: data?.completed_missions,
            icon: 'rocket_launch',
            pluralize: true,
          },
          {
            label: 'UI.GAMIFICATION.PERSONAL_SCORE.STATISTICS_TAB.PULSES',
            value: data?.consumed_pulses,
            svgIcon: 'pulse',
            pluralize: true,
          },
          {
            label: 'UI.GAMIFICATION.PERSONAL_SCORE.STATISTICS_TAB.HOURS',
            value: data?.learn_hours,
            icon: 'schedule',
            pluralize: true,
          },
          {
            label: 'UI.GAMIFICATION.PERSONAL_SCORE.STATISTICS_TAB.PERFORMANCE',
            value: data?.performance_avg,
            icon: 'gps_fixed',
          },
          {
            label: 'UI.GAMIFICATION.PERSONAL_SCORE.STATISTICS_TAB.COMPLETION_RATE',
            value: data?.conclusion_rate,
            icon: 'school',
          },
        ];

        if (score) {
          statistics.unshift({
            label: 'UI.GAMIFICATION.PERSONAL_SCORE.STATISTICS_TAB.POSITION',
            value: data?.position,
            icon: 'trophy',
          });
        }

        return statistics;
      },
    ),
  }),
});
