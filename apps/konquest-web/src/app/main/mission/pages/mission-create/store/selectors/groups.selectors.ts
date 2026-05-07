import { createSelector } from '@ngrx/store';
import { MissionCreateState, MissionGroupsReducer } from '../reducers';
import { selectMissionCreateState } from './feature.selectors';

const selectGroupsState = createSelector(
  selectMissionCreateState,
  (state: MissionCreateState) => state[MissionGroupsReducer.groupsFeatureKey],
);

export const selectGroups = createSelector(selectGroupsState, MissionGroupsReducer.selectAll);

export const selectGroupsWithId = createSelector(selectGroups, (groups) => {
  return groups?.map((group) => ({ ...group, id: group?.id }));
});

export const selectFilteredGroups = createSelector(selectGroupsState, (state) => state.filteredGroups);
