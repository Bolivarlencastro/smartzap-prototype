import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { TransferActions } from '../actions';
import { UserRole } from '@keeps-platform-frontend-workspace/kp-keeps';

export const featureKey = 'transfer';

export interface State extends EntityState<UserRole> {
  isLoading: boolean;
}

export const adapter: EntityAdapter<UserRole> = createEntityAdapter<UserRole>({
  selectId: (userRole) => userRole.id,
});

export const initialState: State = adapter.getInitialState({
  isLoading: false,
});

export const reducer = createReducer(
  initialState,

  on(TransferActions.clear, (): State => {
    return { ...initialState };
  }),

  on(TransferActions.loadUsersByRoleId, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(TransferActions.loadUsersByRoleIdFailure, (): State => {
    return { ...initialState };
  }),

  on(TransferActions.loadUsersByRoleIdSuccess, (state, { users }): State => {
    return adapter.setAll(users, { ...state, isLoading: false });
  }),
);

export const { selectAll } = adapter.getSelectors();
