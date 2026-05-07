import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Group } from 'app/main/group/groups/group.model';
import { MissionActions, MissionGroupsActions } from '../actions';

export const groupsFeatureKey = 'mission-groups';

export interface MissionGroupsState extends EntityState<Group> {
  filteredGroups: Group[];
}

export const adapter = createEntityAdapter<Group>();

export const initialState: MissionGroupsState = adapter.getInitialState({
  filteredGroups: [],
});

export const groupsReducer = createReducer(
  initialState,

  on(MissionGroupsActions.loadGroupsSuccess, (state, { groups }): MissionGroupsState => adapter.setAll(groups, state)),

  on(MissionGroupsActions.addGroupSuccess, (state, { group }): MissionGroupsState => adapter.addOne(group, state)),

  on(
    MissionGroupsActions.removeGroupSuccess,
    (state, { group }): MissionGroupsState => adapter.removeOne(group.id, state),
  ),

  on(
    MissionGroupsActions.filterGroupsSuccess,
    (state, { groups }): MissionGroupsState => ({ ...state, filteredGroups: groups }),
  ),

  on(MissionActions.resetStore, MissionActions.setMissionModel, (): MissionGroupsState => initialState),
);

export const { selectAll } = adapter.getSelectors();
