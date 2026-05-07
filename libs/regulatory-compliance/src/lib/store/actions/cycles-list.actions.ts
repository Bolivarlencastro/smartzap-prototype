import { createAction, props } from '@ngrx/store';
import { CyclesListFilterEvent, CyclesListPaginationEvent, CyclesListResponse } from '../../models';

export const loadCycles = createAction('[Cycles List] Load Normative Cycles');

export const loadCyclesSuccess = createAction(
  '[Cycles List] Normative Cycles Success',
  props<{ response: CyclesListResponse }>(),
);
export const loadCyclesFailure = createAction('[Cycles List] Load Normative Cycles Failure');

export const setFilter = createAction('[Cycles List] Set Filter', props<{ filter: CyclesListFilterEvent }>());

export const setPagination = createAction(
  '[Cycles List] Set Pagination',
  props<{ pagination: CyclesListPaginationEvent }>(),
);

export const deleteCycle = createAction('[Cycles List] Delete Normative Cycle(s)', props<{ ids: string[] }>());

export const resetState = createAction('[Cycles List] Reset State');
