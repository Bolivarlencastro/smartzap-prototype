import { createSelector } from '@ngrx/store';
import { MissionDetailContributorReducers, selectMissionDetailFeatureState, MissionDetailsState } from '../reducers';

export const selectContributorsState = createSelector(
  selectMissionDetailFeatureState,
  (state: MissionDetailsState) => state.featureContributors,
);

export const selectMissionUsersApp = createSelector(
  selectContributorsState,
  (state: MissionDetailContributorReducers.State) => state.users,
);

export const selectMissionContributorsApp = createSelector(
  selectContributorsState,
  (state: MissionDetailContributorReducers.State) => state.contributors,
);

export const selectMissionContributorsLoading = createSelector(
  selectContributorsState,
  (state: MissionDetailContributorReducers.State) => state.loading,
);
