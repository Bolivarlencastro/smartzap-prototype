import * as MissionDetailReducer from './mission-detail.reducer';
import { combineReducers } from '@ngrx/store';

interface MissionDetailDialogFeatureState {
  [MissionDetailReducer.missionDetailFeatureKey]: MissionDetailReducer.MissionDetailState;
}

const missionDetailDialogFeatureInitialState: MissionDetailDialogFeatureState = {
  [MissionDetailReducer.missionDetailFeatureKey]: MissionDetailReducer.initialState,
};

const missionDetailDialogFeatureReducers = combineReducers({
  [MissionDetailReducer.missionDetailFeatureKey]: MissionDetailReducer.missionDetailReducer,
});

const missionDetailDialogFeatureKey = 'mission-detail-dialog';

export {
  missionDetailDialogFeatureKey,
  missionDetailDialogFeatureReducers,
  missionDetailDialogFeatureInitialState,
  MissionDetailDialogFeatureState,
  MissionDetailReducer,
};
