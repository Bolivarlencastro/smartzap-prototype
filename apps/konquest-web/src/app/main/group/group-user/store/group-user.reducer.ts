import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as GroupUserActions from './group-user.actions';
import { GroupUser, GroupUserQueryParams } from '../group-user.model';

export const groupUserFeatureKey = 'groupUsers';
export interface State extends EntityState<GroupUser> {
  groupId: string | null;
  isLoading: boolean;
  queryParams: GroupUserQueryParams;
  total: number;
}

export const adapter: EntityAdapter<GroupUser> = createEntityAdapter<GroupUser>();

export const initialState: State = adapter.getInitialState({
  groupId: null,
  isLoading: false,
  queryParams: {
    page: 1,
    per_page: 10,
    ordering: null,
    search: null,
    deleted: false,
  },
  total: 0,
});

const groupUserReducer = createReducer(
  initialState,

  on(GroupUserActions.init, (state, { groupId }): State => ({ ...state, groupId })),

  on(GroupUserActions.loadGroupUsers, (state): State => {
    return adapter.removeAll({ ...state, isLoading: true });
  }),

  on(GroupUserActions.loadGroupUsersSuccess, (state, { data }): State => {
    return adapter.setAll(data.results || [], {
      ...state,
      total: data.count ?? 0,
      isLoading: false,
    });
  }),

  on(
    GroupUserActions.loadGroupUsersFailure,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(GroupUserActions.deleteGroupUserSuccess, (state, { id }): State => adapter.removeOne(id, state)),

  on(GroupUserActions.addGroupUsers, (state): State => ({ ...state, queryParams: { ...state.queryParams, page: 1 } })),

  on(
    GroupUserActions.filter,
    (state, { search }): State => ({ ...state, queryParams: { ...state.queryParams, page: 1, search } }),
  ),

  on(
    GroupUserActions.order,
    (state, { ordering }): State => ({ ...state, queryParams: { ...state.queryParams, page: 1, ordering } }),
  ),

  on(
    GroupUserActions.filterByDeletedUsers,
    (state, { deleted }): State => ({ ...state, queryParams: { ...state.queryParams, page: 1, deleted } }),
  ),

  on(
    GroupUserActions.setPagination,
    (state, { page, per_page }): State => ({
      ...state,
      queryParams: { ...state.queryParams, page, per_page },
    }),
  ),

  on(GroupUserActions.clearCache, (): State => ({ ...initialState })),
);

export function reducer(state: State | undefined, action: Action): any {
  return groupUserReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
