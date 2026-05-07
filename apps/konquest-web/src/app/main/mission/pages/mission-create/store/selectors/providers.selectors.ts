import { createSelector } from '@ngrx/store';
import { MissionCreateState, MissionProvidersReducer } from '../reducers';
import { selectMissionCreateState } from './feature.selectors';

const selectProvidersState = createSelector(
  selectMissionCreateState,
  (state: MissionCreateState) => state[MissionProvidersReducer.providersFeatureKey],
);

export const selectProviders = createSelector(selectProvidersState, MissionProvidersReducer.selectAll);
