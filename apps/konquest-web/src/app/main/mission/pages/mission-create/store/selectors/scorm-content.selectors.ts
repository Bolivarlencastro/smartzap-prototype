import { createSelector } from '@ngrx/store';
import { MissionCreateState, MissionScormStepsReducer } from '../reducers';
import { selectMissionCreateState } from './feature.selectors';

const selectScormContentState = createSelector(
  selectMissionCreateState,
  (state: MissionCreateState) => state[MissionScormStepsReducer.scormContentsFeatureKey],
);

export const selectScormSteps = createSelector(selectScormContentState, (state) => state?.content?.steps || undefined);
