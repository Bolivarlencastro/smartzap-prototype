import { SortParams } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { TransferFilter } from 'app/main/transfer/models/transfer-filter';
import { Transfer } from 'app/main/transfer/models/transfer.model';
import * as fromActions from '../actions/transfer.actions';

export const featureKey = 'transfers';

export interface State extends EntityState<Transfer> {
  total: number;
  page: number;
  perPage: number;
  isLoading: boolean;
  sort?: SortParams;
  search?: string;
  filter?: TransferFilter;
}

export const adapter = createEntityAdapter<Transfer>();

export const initialState: State = adapter.getInitialState({
  total: 0,
  page: 1,
  perPage: 10,
  isLoading: false,
  sort: undefined,
  search: undefined,
  filter: undefined,
});

export const reducer = createReducer(
  initialState,

  on(fromActions.setPage, (state, { page }): State => ({ ...state, page })),

  on(fromActions.paginationChange, (state, { page, perPage }): State => ({ ...state, page, perPage })),

  on(fromActions.setSearch, (state, { search }): State => ({ ...state, search })),

  on(fromActions.setFilters, (state, { filter }): State => ({ ...state, filter })),

  on(fromActions.setSort, (state, { sort }): State => ({ ...state, sort })),

  on(fromActions.loadTransfers, (state): State => adapter.removeAll({ ...state, isLoading: true })),

  on(
    fromActions.loadTransfersFailure,
    fromActions.deleteTransferFailure,
    (state): State => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(
    fromActions.loadTransfersSuccess,
    (state, { payload }): State =>
      adapter.setAll(payload.results || [], {
        ...state,
        isLoading: false,
        total: payload.count || 0,
      }),
  ),

  on(
    fromActions.deleteTransferSuccess,
    (state, { id }): State =>
      adapter.removeOne(id, {
        ...state,
        isLoading: false,
        total: Math.max(state.total - 1, 0),
      }),
  ),

  on(fromActions.resetState, (): State => initialState),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
