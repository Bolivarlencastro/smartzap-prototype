import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { UserActions } from '../actions';
import { User } from '@keeps-platform-frontend-workspace/kp-keeps';

export const featureKey = 'userCache';

export interface State extends EntityState<User> {
  isLoading: boolean;
  page: number;
  total: number;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  page: 1,
  total: 0,
});

const userReducer = createReducer(
  initialState,

  on(UserActions.clearCache, (): State => ({ ...initialState })),

  on(
    UserActions.loadUsers,
    (state): State => ({
      ...state,
      isLoading: true,
      page: state.page + 1,
    }),
  ),

  on(
    UserActions.loadUsersFailure,
    (state): State => ({
      ...state,
      isLoading: false,
      total: 0,
    }),
  ),

  on(
    UserActions.loadUsersSuccess,
    (state, { data }): State =>
      adapter.addMany(data.data, {
        ...state,
        isLoading: false,
        total: data.meta?.total_items,
      }),
  ),
);

export function reducer(state: State | undefined, action: Action): any {
  return userReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
