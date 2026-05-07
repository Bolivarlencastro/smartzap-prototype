import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as GroupLearningTrailActions from './group-learning-trail.actions';
import { GroupLearningTrail } from '../group-learning-trail.model';

export const groupLearningTrailsFeatureKey = 'groupLearningTrails';

export interface State extends EntityState<GroupLearningTrail> {
  isLoading: boolean;
  page: number;
  per_page: number;
  total: number;
}

export const adapter: EntityAdapter<GroupLearningTrail> = createEntityAdapter<GroupLearningTrail>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  page: 1,
  per_page: 10,
  total: 0,
});

const groupLearningTrailReducer = createReducer(
  initialState,
  on(GroupLearningTrailActions.deleteGroupLearningTrail, (state, action): State => adapter.removeOne(action.id, state)),
  on(
    GroupLearningTrailActions.loadGroupLearningTrails,
    (state): State => ({
      ...state,
      isLoading: true,
    }),
  ),
  on(
    GroupLearningTrailActions.filterGroupLearningTrails,
    (state, { queryParams }): State => ({
      ...initialState,
      page: queryParams?.page ?? 1,
      per_page: queryParams?.per_page ?? state.per_page,
      isLoading: true,
    }),
  ),
  on(
    GroupLearningTrailActions.loadGroupLearningTrailsSuccess,
    (state, { data }): State =>
      adapter.setAll(data.results, {
        ...state,
        total: data.count,
        isLoading: false,
      }),
  ),
  on(
    GroupLearningTrailActions.loadGroupLearningTrailsFailure,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),
  on(GroupLearningTrailActions.clearCache, (): State => ({ ...initialState })),
);

export function reducer(state: State | undefined, action: Action): any {
  return groupLearningTrailReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
