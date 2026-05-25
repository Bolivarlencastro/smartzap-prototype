import { createAction, props } from '@ngrx/store';
import { PushCampaignModel } from '@keeps-platform-frontend-workspace/kp-keeps';

const load = createAction('[PM - Upcoming Appointments] Load');
const loadSuccess = createAction(
  '[PM - Upcoming Appointments] Load Success',
  props<{ data: PushCampaignModel[]; total: number }>(),
);
const loadFailure = createAction('[PM - Upcoming Appointments] Load Failure');
const search = createAction('[PM - Upcoming Appointments] Search', props<{ search: string }>());
const changePage = createAction('[PM - Upcoming Appointments] Change Page', props<{ page: number; limit: number }>());
const sort = createAction('[PM - Upcoming Appointments] Sort', props<{ sortBy: string[] }>());
const cancelPush = createAction('[PM - Upcoming Appointments] Cancel Push', props<{ id: string }>());
const cancelPushSuccess = createAction('[PM - Upcoming Appointments] Cancel Push Success', props<{ id: string }>());
const cancelPushFailure = createAction('[PM - Upcoming Appointments] Cancel Push Failure');

export const UpcomingAppointmentsActions = {
  load,
  loadSuccess,
  loadFailure,
  search,
  changePage,
  sort,
  cancelPush,
  cancelPushSuccess,
  cancelPushFailure,
};
