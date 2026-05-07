import { Sort } from '@angular/material/sort';
import { Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { Led } from '../../models/led';

const init = createAction('[Led List] Init');

const fetchLed = createAction('[Led List] Fetch Led');
const fetchLedSuccess = createAction('[Led List] Fetch Led Success', props<{ response: Pagination<Led> }>());
const fetchLedFailure = createAction('[Led List] Fetch Led Failure');

const search = createAction('[Led List] Search', props<{ search: string }>());

const sort = createAction('[Led List] Sort', props<{ sort: Sort }>());

const setPagination = createAction('[Led List] Set Pagination', props<{ page: number; per_page: number }>());

export const LedListActions = {
  init,
  fetchLed,
  fetchLedSuccess,
  fetchLedFailure,
  search,
  sort,
  setPagination,
};
