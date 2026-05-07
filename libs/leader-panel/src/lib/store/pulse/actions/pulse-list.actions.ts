import { Sort } from '@angular/material/sort';
import { Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { Pulse } from '../../../models/pulse';

const init = createAction('[Pulse List] Init');

const fetchPulses = createAction('[Pulse List] Fetch Pulses');
const fetchPulsesSuccess = createAction('[Pulse List] Fetch Pulses Success', props<{ response: Pagination<Pulse> }>());
const fetchPulsesFailure = createAction('[Pulse List] Fetch Pulses Failure');

const search = createAction('[Pulse List] Search', props<{ search: string }>());

const sort = createAction('[Pulse List] Sort', props<{ sort: Sort }>());

const setPagination = createAction('[Pulse List] Set Pagination', props<{ page: number; per_page: number }>());

export const PulseListActions = {
  init,
  fetchPulses,
  fetchPulsesSuccess,
  fetchPulsesFailure,
  search,
  sort,
  setPagination,
};
