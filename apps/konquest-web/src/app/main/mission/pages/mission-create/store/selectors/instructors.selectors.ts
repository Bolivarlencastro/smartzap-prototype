import { createSelector } from '@ngrx/store';
import { MissionCreateState, MissionInstructorsReducer } from '../reducers';
import { selectMissionCreateState } from './feature.selectors';

const selectInstructorsState = createSelector(
  selectMissionCreateState,
  (state: MissionCreateState) => state[MissionInstructorsReducer.instructorsFeatureKey],
);

export const selectInstructors = createSelector(selectInstructorsState, MissionInstructorsReducer.selectAll);

export const selectFilteredInstructors = createSelector(selectInstructorsState, (state) => state.filteredInstructors);
