import { User } from '@core/model';
import { createAction, props } from '@ngrx/store';
import { Contributor } from '@core/model/contributor.model';

export const getChannelContributor = createAction(
  '[ChannelDetail] Get Channel Contributor',
  props<{ channel_id: string }>(),
);

export const getChannelContributorSuccess = createAction(
  '[ChannelDetail] Get Channel Contributor Success',
  props<{ contributors: any[] }>(),
);

export const getChannelContributorFailure = createAction(
  '[ChannelDetail] Get Channel Contributor Failure',
  props<{ errorMsg: string }>(),
);

export const addChannelContributor = createAction(
  '[ChannelDetail] Add Channel Contributor',
  props<{ channel_id: any; user_id: any }>(),
);

export const addChannelContributorSuccess = createAction(
  '[ChannelDetail] Add Channel Contributor Success',
  props<{ contributor: Contributor }>(),
);

export const addChannelContributorFailure = createAction(
  '[ChannelDetail] Add Channel Contributor Failure',
  props<{ errorMsg: string }>(),
);

export const deleteChannelContributor = createAction(
  '[ChannelDetail] Delete Channel Contributor',
  props<{ channel_id: string; user_id: string }>(),
);

export const deleteChannelContributorSuccess = createAction('[ChannelDetail] Delete Channel Contributor Success');

export const deleteChannelContributorFailure = createAction(
  '[ChannelDetail] Delete Channel Contributor Failure',
  props<{ errorMsg: string }>(),
);

export const getUsers = createAction('[ChannelDetail] Get Users', props<{ per_page: string; search: string }>());

export const getUsersSuccess = createAction('[ChannelDetail] Get Users Success', props<{ users: User[] }>());

export const getUsersFailure = createAction('[ChannelDetail] Get Users Failure', props<{ errorMsg: string }>());
