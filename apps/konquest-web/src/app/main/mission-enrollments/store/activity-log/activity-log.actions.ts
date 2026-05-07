import { createAction, props } from '@ngrx/store';
import {
  ActivityLogItem,
  ActivityLogPagination,
  ActivityLogStoreFilter,
  PageResponse,
} from '@keeps-platform-frontend-workspace/kp-keeps';

export const init = createAction('[Activity Log] Init');

export const setUserOptions = createAction('[Activity Log] Set User Options', props<{ users: any[] }>());

export const loadData = createAction('[Activity Log] Load Data');

export const loadDataSuccess = createAction(
  '[Activity Log] Load Data Success',
  props<{ response: PageResponse<ActivityLogItem> }>(),
);

export const loadDataFailure = createAction('[Activity Log] Load Data Failure');

export const filterByTerm = createAction('[Activity Log] Filter By Term', props<{ search: string }>());

export const setFilter = createAction('[Activity Log] Set Filter', props<{ filter: ActivityLogStoreFilter }>());

export const setPagination = createAction(
  '[Activity Log] Set Pagination',
  props<{ pagination: Partial<ActivityLogPagination> }>(),
);

export const exportLog = createAction('[Activity Log] Export Log', props<{ id: string }>());

export const resetState = createAction('[Activity Log] Reset State');
