import { createAction, props } from '@ngrx/store';

export const openDialog = createAction(
  '[Certificate Upload] Open Certificate Upload Dialog',
  props<{ enrollmentId: string }>(),
);

export const uploadCertificate = createAction(
  '[Certificate Upload] Upload Certificate',
  props<{ certificate: File }>(),
);

export const uploadCertificateSuccess = createAction('[Certificate Upload] Upload Certificate Success');

export const uploadCertificateFailure = createAction('[Certificate Upload] Upload Certificate Failure');

export const loadCertificateHistorySuccess = createAction(
  '[Certificate Upload] Load Certificate History Success',
  props<{
    history: string;
  }>(),
);

export const loadCertificateHistoryFailure = createAction('[Certificate Upload] Load Certificate History Failure');

export const resetState = createAction('[Certificate Upload] Reset State');
