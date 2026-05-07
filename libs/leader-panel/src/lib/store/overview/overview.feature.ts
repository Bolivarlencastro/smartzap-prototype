import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { OverviewSummary, OverviewTeamSummary, OverviewViewModel } from '../../models/overview';
import { OverviewActions } from './overview.actions';

export interface OverviewFeatureState {
  summary: OverviewSummary;
  summaryLoading: boolean;
  teamSummary: OverviewTeamSummary;
  teamSummaryLoading: boolean;
  hasGamification: boolean;
  hasNormative: boolean;
}

export const overviewInitialState: OverviewFeatureState = {
  summary: null,
  summaryLoading: false,
  teamSummary: null,
  teamSummaryLoading: false,
  hasGamification: false,
  hasNormative: false,
};

export const overviewReducer = createReducer(
  overviewInitialState,

  on(
    OverviewActions.init,
    (state): OverviewFeatureState => ({ ...state, summaryLoading: true, teamSummaryLoading: true }),
  ),

  on(
    OverviewActions.setActivatedServices,
    (state, { hasGamification, hasNormative }): OverviewFeatureState => ({ ...state, hasGamification, hasNormative }),
  ),

  on(
    OverviewActions.fetchSummarySuccess,
    (state, { summary }): OverviewFeatureState => ({ ...state, summary, summaryLoading: false }),
  ),
  on(OverviewActions.fetchSummaryFailure, (state): OverviewFeatureState => ({ ...state, summaryLoading: false })),

  on(
    OverviewActions.fetchTeamSummarySuccess,
    (state, { teamSummary }): OverviewFeatureState => ({ ...state, teamSummary, teamSummaryLoading: false }),
  ),
  on(
    OverviewActions.fetchTeamSummaryFailure,
    (state): OverviewFeatureState => ({ ...state, teamSummaryLoading: false }),
  ),
);

export const overviewFeature = createFeature({
  name: 'overview',
  reducer: overviewReducer,
  extraSelectors: ({
    selectSummary,
    selectHasGamification,
    selectHasNormative,
    selectTeamSummary,
    selectSummaryLoading,
    selectTeamSummaryLoading,
  }) => ({
    selectViewModel: createSelector(
      selectSummary,
      selectHasGamification,
      selectHasNormative,
      selectTeamSummary,
      selectSummaryLoading,
      selectTeamSummaryLoading,
      (summary, hasGamification, hasNormative, teamSummary, summaryLoading, teamSummaryLoading): OverviewViewModel => ({
        summary,
        hasGamification,
        hasNormative,
        teamSummary,
        summaryLoading,
        teamSummaryLoading,
      }),
    ),
  }),
});
