import { Sort } from '@angular/material/sort';
import { SearchPageResponse } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { Trail } from '../../../models/trail';

const init = createAction('[Trail List] Init');

const fetchTrails = createAction('[Trail List] Fetch Trails');
const fetchTrailsSuccess = createAction(
  '[Trail List] Fetch Trails Success',
  props<{ response: SearchPageResponse<Trail> }>(),
);
const fetchTrailsFailure = createAction('[Trail List] Fetch Trails Failure');

const search = createAction('[Trail List] Search', props<{ search: string }>());

const sort = createAction('[Trail List] Sort', props<{ sort: Sort }>());

const setPagination = createAction('[Trail List] Set Pagination', props<{ page: number; per_page: number }>());

export const TrailListActions = {
  init,
  fetchTrails,
  fetchTrailsSuccess,
  fetchTrailsFailure,
  search,
  sort,
  setPagination,
};
