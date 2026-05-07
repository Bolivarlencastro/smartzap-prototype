import { createSelector } from '@ngrx/store';
import { MissionCreateState, MissionStagesReducer } from '../reducers';
import { selectMissionCreateState } from './feature.selectors';

const selectStagesState = createSelector(
  selectMissionCreateState,
  (state: MissionCreateState) => state[MissionStagesReducer.stagesFeatureKey],
);

export const selectStages = createSelector(selectStagesState, MissionStagesReducer.selectAll);
