import { MissionProvider } from 'app/main/mission/mission.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ProvidersActions } from '../actions';

export interface ProvidersFeatureState {
  providers: MissionProvider[];
}

const providersInitialState: ProvidersFeatureState = {
  providers: [],
};

const providersReducer = createReducer(
  providersInitialState,

  on(ProvidersActions.loadProvidersSuccess, (state, { providers }): ProvidersFeatureState => ({ ...state, providers })),
);

export const providersFeature = createFeature({ name: 'providers', reducer: providersReducer });
