import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from 'app/shared/store/reducers';
import * as fromEnrollments from './enrollments.reducer';

export const settingsFeatureKey = 'settings';

export interface SettingsState {
  [fromEnrollments.featureKey]: fromEnrollments.State;
}

export interface State extends fromRoot.State {
  [settingsFeatureKey]: SettingsState;
}

export function reducers(
  state: SettingsState | undefined,
  action: Action,
): {
  [fromEnrollments.featureKey]: fromEnrollments.State;
} {
  return combineReducers({
    [fromEnrollments.featureKey]: fromEnrollments.reducer,
  })(state, action);
}

export const selectSettingsFeatureState = createFeatureSelector<SettingsState>(settingsFeatureKey);
