import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MissionProvider } from 'app/main/mission/mission.model';
import { MissionActions, MissionProvidersActions } from '../actions';

export const providersFeatureKey = 'providers';

export type MissionProvidersState = EntityState<MissionProvider>;

export const adapter = createEntityAdapter<MissionProvider>();

export const initialState: MissionProvidersState = adapter.getInitialState();

export const providersReducer = createReducer(
  initialState,

  on(MissionProvidersActions.filterProvidersSuccess, (state, { providers }): MissionProvidersState => {
    return adapter.setAll(providers, { ...state });
  }),

  on(MissionActions.resetStore, (): MissionProvidersState => initialState),
);

export const { selectAll } = adapter.getSelectors();
