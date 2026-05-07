import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { GroupMission } from '../group-mission.model';
import * as GroupMissionActions from './group-mission.actions';

export const groupMissionsFeatureKey = 'groupMissions';

export interface State extends EntityState<GroupMission> {
  isLoading: boolean;
  page: number;
  per_page: number;
  total: number;
}

export const adapter: EntityAdapter<GroupMission> = createEntityAdapter<GroupMission>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  page: 1,
  per_page: 10,
  total: 0,
});

const groupMissionReducer = createReducer(
  initialState,
  on(GroupMissionActions.deleteGroupMission, (state, action): State => adapter.removeOne(action.id, state)),
  on(
    GroupMissionActions.loadGroupMissions,
    (state): State => ({
      ...state,
      isLoading: true,
    }),
  ),
  on(
    GroupMissionActions.filterGroupMissions,
    (state, { queryParams }): State => ({
      ...initialState,
      page: queryParams?.page ?? 1,
      per_page: queryParams?.per_page ?? state.per_page,
      isLoading: true,
    }),
  ),
  on(
    GroupMissionActions.loadGroupMissionsSuccess,
    (state, { data }): State =>
      adapter.setAll(data.results, {
        ...state,
        total: data.count,
        isLoading: false,
      }),
  ),
  on(
    GroupMissionActions.loadGroupMissionsFailure,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),
  on(GroupMissionActions.clearCache, (): State => ({ ...initialState })),
);

export function reducer(state: State | undefined, action: Action): any {
  return groupMissionReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
