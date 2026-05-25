import { createAction, props } from '@ngrx/store';
import { PushCampaignModel } from '@keeps-platform-frontend-workspace/kp-keeps';

const load = createAction('[PM - Push History] Load');
const loadSuccess = createAction(
  '[PM - Push History] Load Success',
  props<{ data: PushCampaignModel[]; total: number }>(),
);
const loadFailure = createAction('[PM - Push History] Load Failure');
const search = createAction('[PM - Push History] Search', props<{ search: string }>());
const changePage = createAction('[PM - Push History] Change Page', props<{ page: number; limit: number }>());
const sort = createAction('[PM - Push History] Sort', props<{ sortBy: string[] }>());

export const PushHistoryActions = {
  load,
  loadSuccess,
  loadFailure,
  search,
  changePage,
  sort,
};
