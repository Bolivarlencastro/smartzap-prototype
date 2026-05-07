import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMission from '../reducers/mission.reducer';

export const selectMissionState = createFeatureSelector<fromMission.State>(fromMission.featureKey);

export const selectAll = createSelector(selectMissionState, fromMission.selectAll);
export const selectIsLoading = createSelector(selectMissionState, (state) => state.isLoading);
export const selectTotal = createSelector(selectMissionState, (state) => state.total);
export const selectPage = createSelector(selectMissionState, (state) => state.page);
export const selectLoaded = createSelector(selectMissionState, (state) => selectAll.length >= state.total);
