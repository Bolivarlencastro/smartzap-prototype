import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGroupMission from './group-mission.reducer';

export const selectGroupMissionState = createFeatureSelector<fromGroupMission.State>(
  fromGroupMission.groupMissionsFeatureKey,
);

export const selectAll = createSelector(selectGroupMissionState, fromGroupMission.selectAll);
export const selectIsLoading = createSelector(selectGroupMissionState, (state) => state.isLoading);
export const selectTotal = createSelector(selectGroupMissionState, (state) => state.total);
export const selectCurrentPage = createSelector(selectGroupMissionState, (state) => Math.max(state.page - 1, 0));
export const selectPerPage = createSelector(selectGroupMissionState, (state) => state.per_page);
