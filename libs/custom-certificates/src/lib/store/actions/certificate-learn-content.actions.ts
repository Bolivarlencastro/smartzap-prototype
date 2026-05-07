import { createAction, props } from '@ngrx/store';
import { CustomCertificateDto, LearnContentCertificateChange } from '@keeps-platform-frontend-workspace/kp-keeps';

export const vinculateLearnContent = createAction(
  '[Certificate Learn Content] Vinculate Learn Content',
  props<{ event: LearnContentCertificateChange }>(),
);

export const vinculateLearnContentSuccess = createAction(
  '[Certificate Learn Content] Vinculate Learn Content Success',
  props<{ certificate: CustomCertificateDto }>(),
);

export const vinculateLearnContentFailure = createAction(
  '[Certificate Learn Content] Vinculate Learn Content Failure',
  props<{ error: Error }>(),
);

export const desvinculateLearnContent = createAction(
  '[Certificate Learn Content] Desvinculate Learn Content',
  props<{ learnContentId: string }>(),
);

export const desvinculateLearnContentSuccess = createAction(
  '[Certificate Learn Content] Desvinculate Learn Content Success',
);

export const desvinculateLearnContentFailure = createAction(
  '[Certificate Learn Content] Desvinculate Learn Content Failure',
  props<{ error: Error }>(),
);

export const loadLearnContentCertificate = createAction(
  '[Certificate Learn Content] Load Certificate Learn Content',
  props<{ learnContentId: string }>(),
);

export const loadLearnContentCertificateSuccess = createAction(
  '[Certificate Learn Content] Load Certificate Learn Content Success',
  props<{ certificate: CustomCertificateDto }>(),
);

export const loadLearnContentCertificateFailure = createAction(
  '[Certificate Learn Content] Load Certificate Learn Content Failure',
  props<{ error: Error }>(),
);
