import { createSelector } from '@ngrx/store';
import { MissionContributorsReducer, MissionCreateState } from '../reducers';
import { selectMissionCreateState } from './feature.selectors';

const selectContributorsState = createSelector(
  selectMissionCreateState,
  (state: MissionCreateState) => state[MissionContributorsReducer.contributorsFeatureKey],
);

export const selectContributors = createSelector(selectContributorsState, MissionContributorsReducer.selectAll);

export const selectContributorsUser = createSelector(selectContributors, (contributors) => {
  return contributors?.map((contributor) => contributor.user);
});

export const selectFilteredUsers = createSelector(selectContributorsState, (state) => state.filteredUsers);
