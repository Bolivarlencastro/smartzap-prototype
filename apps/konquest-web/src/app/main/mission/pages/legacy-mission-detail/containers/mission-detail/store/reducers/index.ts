import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import * as MissionDetailContributorReducers from './mission-detail-contributor.reducer';
import * as MissionDetailReducers from './mission-detail.reducer';
import * as fromRoot from 'app/shared/store/reducers';
import * as EvaluationsFilterReducer from './evaluations-filter.reducer';

export const missionDetailFeatureKey = 'mission-detail';

export { MissionDetailContributorReducers, MissionDetailReducers, EvaluationsFilterReducer };
export interface MissionDetailsState {
  [MissionDetailContributorReducers.featureKey]: MissionDetailContributorReducers.State;
  [MissionDetailReducers.featureKey]: MissionDetailReducers.State;
}

export interface State extends fromRoot.State {
  [missionDetailFeatureKey]: MissionDetailsState;
}

export const missionDetailInitialState = {
  [missionDetailFeatureKey]: {
    [MissionDetailContributorReducers.featureKey]: MissionDetailContributorReducers.initialState,
    [MissionDetailReducers.featureKey]: MissionDetailReducers.initialState,
  },
};

export function reducers(state: MissionDetailsState | undefined, action: Action) {
  return combineReducers({
    [MissionDetailContributorReducers.featureKey]: MissionDetailContributorReducers.reducer,
    [MissionDetailReducers.featureKey]: MissionDetailReducers.reducer,
  })(state, action);
}

export const selectMissionDetailFeatureState = createFeatureSelector<MissionDetailsState>(missionDetailFeatureKey);
