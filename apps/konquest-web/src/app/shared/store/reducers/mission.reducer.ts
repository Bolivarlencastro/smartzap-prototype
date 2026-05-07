import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Mission } from 'app/main/mission/mission.model';
import { MissionActions } from '../actions';

export const featureKey = 'missionCache';

export interface State extends EntityState<Mission> {
  isLoading: boolean;
  page: number;
  total: number;
}

export const adapter: EntityAdapter<Mission> = createEntityAdapter<Mission>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  page: 1,
  total: 0,
});

const missionReducer = createReducer(
  initialState,

  on(MissionActions.clearCache, MissionActions.filterMissions, (): State => ({ ...initialState })),

  on(
    MissionActions.loadMissions,
    (state): State => ({
      ...state,
      isLoading: true,
      page: state.page + 1,
    }),
  ),

  on(
    MissionActions.loadMissionsFailure,
    (state): State => ({
      ...state,
      isLoading: false,
      total: 0,
    }),
  ),

  on(
    MissionActions.loadMissionsSuccess,
    (state, { data }): State =>
      adapter.addMany(data.results, {
        ...state,
        isLoading: false,
        total: data.count,
      }),
  ),
);

export function reducer(state: State | undefined, action: Action): any {
  return missionReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
