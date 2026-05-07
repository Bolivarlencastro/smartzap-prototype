import {
  CaixaPartner,
  CaixaSmartZapUser,
  CaixaSmartZapUserSignUpDto,
  PageDto,
  PartnerType,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

export const openDialog = createAction('[User Registration] Open Dialog');

export const setPartnerType = createAction(
  '[User Registration] Set Partner Type',
  props<{ partnerType: PartnerType }>(),
);

export const searchPartner = createAction('[User Registration] Search Partner', props<{ search: string }>());

export const searchPartnerSuccess = createAction(
  '[User Registration] Search Partner Success',
  props<{ result: PageDto<CaixaPartner> }>(),
);

export const searchPartnerFailure = createAction(
  '[User Registration] Search Partner Failure',
  props<{ error: unknown }>(),
);

export const signUpUser = createAction(
  '[User Registration] Sign Up User',
  props<{ userSignUpDto: CaixaSmartZapUserSignUpDto }>(),
);

export const signUpUserSuccess = createAction(
  '[User Registration] Sign Up User Success',
  props<{ response: CaixaSmartZapUser; isEnrolledInCourse: boolean }>(),
);

export const signUpUserFailure = createAction('[User Registration] Sign Up User Failure', props<{ error: unknown }>());

export const reset = createAction('[User Registration] Reset');
