import { CaixaPartner, PageDto, PartnerType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const openDialog = createAction('[Partner Selection] Open Dialog');

export const setPartnerType = createAction(
  '[Partner Selection] Set Partner Type',
  props<{ partnerType: PartnerType }>(),
);

export const searchPartner = createAction('[Partner Selection] Search Partner', props<{ search: string }>());

export const searchPartnerSuccess = createAction(
  '[Partner Selection] Search Partner Success',
  props<{ result: PageDto<CaixaPartner> }>(),
);

export const searchPartnerFailure = createAction(
  '[Partner Selection] Search Partner Failure',
  props<{ error: unknown }>(),
);

export const selectPartner = createAction('[Partner Selection] Select Partner', props<{ partner: CaixaPartner }>());

export const reset = createAction('[Partner Selection] Reset');
