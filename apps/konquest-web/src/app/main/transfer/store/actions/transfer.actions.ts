import { Pagination } from '@core/model';
import { KeepsError } from '@core/model/error.model';
import { SortParams } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { TransferFilter } from 'app/main/transfer/models/transfer-filter';
import { Transfer } from '../../models/transfer.model';

export const setPage = createAction('[Transfers] Set Page', props<{ page: number }>());

export const paginationChange = createAction(
  '[Transfers] Pagination Change',
  props<{ page: number; perPage: number }>(),
);

export const setSearch = createAction('[Transfers] Set Search', props<{ search?: string }>());

export const setFilters = createAction('[Transfers] Set filters', props<{ filter: TransferFilter }>());

export const setSort = createAction('[Transfers] Set Sort', props<{ sort: SortParams }>());

export const loadTransfers = createAction('[Transfers] Load Transfers');

export const loadTransfersSuccess = createAction(
  '[Transfers] Load Transfers Success',
  props<{ payload: Pagination<Transfer> }>(),
);

export const loadTransfersFailure = createAction('[Transfers] Load Transfers Failure', props<{ error: KeepsError }>());

export const deleteTransfer = createAction('[Transfers] Delete Transfer', props<{ id: string }>());

export const deleteTransferSuccess = createAction('[Transfers] Delete Transfer Success', props<{ id: string }>());

export const deleteTransferFailure = createAction(
  '[Transfers] Delete Transfer Failure',
  props<{ error: KeepsError }>(),
);

export const resetState = createAction('[Transfers] Reset State');
