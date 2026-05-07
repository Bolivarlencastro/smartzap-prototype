import { createSelector } from '@ngrx/store';
import { MissionCreateState, MissionTypesReducer } from '../reducers';
import { selectMissionCreateState } from './feature.selectors';

const selectTypesState = createSelector(
  selectMissionCreateState,
  (state: MissionCreateState) => state[MissionTypesReducer.typesFeatureKey],
);

export const selectTypes = createSelector(selectTypesState, MissionTypesReducer.selectAll);

export const selectTypesLoaded = createSelector(selectTypesState, (state) => state.loaded);
