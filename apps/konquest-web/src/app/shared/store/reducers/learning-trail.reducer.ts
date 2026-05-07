import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { LearningTrail } from 'app/main/learning-trail/model/learning-trail';
import { LearningTrailActions } from '../actions';

export const featureKey = 'learningTrailCache';

export interface State extends EntityState<LearningTrail> {
  isLoading: boolean;
  page: number;
  total: number;
}

export const adapter: EntityAdapter<LearningTrail> = createEntityAdapter<LearningTrail>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  page: 1,
  total: 0,
});

const learningTrailReducer = createReducer(
  initialState,

  on(LearningTrailActions.clearCache, LearningTrailActions.filterLearningTrails, (): State => ({ ...initialState })),

  on(
    LearningTrailActions.loadLearningTrails,
    (state): State => ({
      ...state,
      isLoading: true,
      page: state.page + 1,
    }),
  ),

  on(
    LearningTrailActions.loadLearningTrailsFailure,
    (state): State => ({
      ...state,
      isLoading: false,
      total: 0,
    }),
  ),

  on(
    LearningTrailActions.loadLearningTrailsSuccess,
    (state, { data }): State =>
      adapter.addMany(data.results, {
        ...state,
        isLoading: false,
        total: data.count,
      }),
  ),
);

export function reducer(state: State | undefined, action: Action): any {
  return learningTrailReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
