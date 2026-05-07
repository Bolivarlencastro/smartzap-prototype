import { createAction, props } from '@ngrx/store';

export const loadGroupChannels = createAction(
  '[GroupChannel] Load GroupChannels',
  props<{ id: string; queryParams?: any }>(),
);

export const filterGroupChannels = createAction(
  '[GroupChannel] Filter GroupChannels',
  props<{ id: string; queryParams?: any }>(),
);

export const loadGroupChannelsSuccess = createAction(
  '[GroupChannel] Load GroupChannels Success',
  props<{ data: any }>(),
);

export const loadGroupChannelsFailure = createAction(
  '[GroupChannel] Load GroupChannels Failure',
  props<{ error: Error }>(),
);

export const addGroupChannels = createAction(
  '[GroupChannel/API] Add GroupChannels',
  props<{ id: string; channelIds: string[] }>(),
);

export const deleteGroupChannel = createAction(
  '[GroupChannel/API] Delete GroupChannel',
  props<{ id: string; groupId: string; channelId: string }>(),
);

export const deleteGroupChannelSuccess = createAction('[GroupChannel/API] Delete GroupChannel Success');

export const clearCache = createAction('[GroupChannel/API] Clear GroupChannels');
