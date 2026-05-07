import { createAction, props } from '@ngrx/store';

export const addNote = createAction(
  '[Event Management User Actions] Add Note',
  props<{ presenceId: string | string[]; observation?: string; batch?: boolean }>(),
);
export const addNoteSuccess = createAction('[Event Management User Actions] Add Note Success');

export const togglePresence = createAction(
  '[Event Management User Actions] Toggle Presence',
  props<{ checked: boolean; presenceId: string | string[]; batch?: boolean }>(),
);
export const togglePresenceSuccess = createAction(
  '[Event Management User Actions] Toggle Presence Success',
  props<{ batch: boolean }>(),
);

export const sendInvite = createAction(
  '[Event Management User Actions] Send Invite',
  props<{ enrollmentId: string[] }>(),
);
export const sendInviteSuccess = createAction('[Event Management User Actions] Send Invite Success');

export const removeUser = createAction(
  '[Event Management User Actions] Remove User',
  props<{ enrollmentId: string | string[]; batch?: boolean }>(),
);
export const removeUserSuccess = createAction('[Event Management User Actions] Remove User Success');
