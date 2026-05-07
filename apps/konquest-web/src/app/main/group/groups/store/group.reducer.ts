import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as fromActions from './group.actions';
import { Group } from '../group.model';

export const groupFeatureKey = 'groupCache';

export interface State extends EntityState<Group> {
  isLoading: boolean;
  total: number;
  page: number;
  per_page: number;
  search: string;
}

export const adapter: EntityAdapter<Group> = createEntityAdapter<Group>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  total: 0,
  page: 1,
  per_page: 10,
  search: '',
});

const groupReducer = createReducer(
  initialState,

  on(
    fromActions.deleteGroupSuccess,
    (state, action): State => adapter.removeOne(action.id, { ...state, total: Math.max(state.total - 1, 0) }),
  ),

  on(
    fromActions.loadGroups,
    (state): State => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    fromActions.loadGroupsSuccess,
    (state, { pagination }): State =>
      adapter.setAll(pagination.results, { ...state, isLoading: false, total: pagination.count || 0 }),
  ),

  on(
    fromActions.loadGroupsFailure,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(fromActions.clearCache, (): State => ({ ...initialState })),

  on(
    fromActions.importGroup,
    (state): State => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    fromActions.importGroupSuccess,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(
    fromActions.importGroupFailure,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(fromActions.setPagination, (state, { page, per_page }): State => ({ ...state, page, per_page })),

  on(fromActions.updateFilter, (state, { search }): State => ({ ...state, search, page: 1 })),
);

export function reducer(state: State | undefined, action: Action): any {
  return groupReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
