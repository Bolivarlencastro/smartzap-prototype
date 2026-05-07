import { Sort } from '@angular/material/sort';
import { SearchPageResponse } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { Event } from '../../../models/events';

const init = createAction('[Event List] Init');

const fetchEvents = createAction('[Event List] Fetch Events');
const fetchEventsSuccess = createAction(
  '[Event List] Fetch Events Success',
  props<{ response: SearchPageResponse<Event> }>(),
);
const fetchEventsFailure = createAction('[Event List] Fetch Events Failure');

const search = createAction('[Event List] Search', props<{ search: string }>());

const sort = createAction('[Event List] Sort', props<{ sort: Sort }>());

const setPagination = createAction('[Event List] Set Pagination', props<{ page: number; per_page: number }>());

export const EventListActions = {
  init,
  fetchEvents,
  fetchEventsSuccess,
  fetchEventsFailure,
  search,
  sort,
  setPagination,
};
