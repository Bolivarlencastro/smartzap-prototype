import { Sort } from '@angular/material/sort';
import { Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { Channel } from '../../../models/channel';

const init = createAction('[Channel List] Init');

const fetchChannels = createAction('[Channel List] Fetch Channels');
const fetchChannelsSuccess = createAction(
  '[Channel List] Fetch Channels Success',
  props<{ response: Pagination<Channel> }>(),
);
const fetchChannelsFailure = createAction('[Channel List] Fetch Channels Failure');

const search = createAction('[Channel List] Search', props<{ search: string }>());

const sort = createAction('[Channel List] Sort', props<{ sort: Sort }>());

const setPagination = createAction('[Channel List] Set Pagination', props<{ page: number; per_page: number }>());

export const ChannelListActions = {
  init,
  fetchChannels,
  fetchChannelsSuccess,
  fetchChannelsFailure,
  search,
  sort,
  setPagination,
};
