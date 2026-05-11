import { createAction, props } from '@ngrx/store';
import { CustomCertificateDto, CustomCertificatesFilter, Paginated } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadCertificates = createAction('[Certificates List] Load Custom Certificates');

export const loadCertificatesSuccess = createAction(
  '[Certificates List] Load Custom Certificates Success',
  props<{ response: Paginated<CustomCertificateDto> }>(),
);

export const loadCertificatesFailure = createAction('[Certificates List] Load Custom Certificates Failure');

export const openDeleteDialog = createAction(
  '[Certificate List] Open Dialog For Confirm Delete Certificate',
  props<{ certificate: CustomCertificateDto }>(),
);

export const deleteCertificate = createAction(
  '[Certificate List] Delete Certificate',
  props<{ certificate: CustomCertificateDto }>(),
);

export const deleteCertificateSuccess = createAction(
  '[Certificate List] Delete Certificate Success',
  props<{ id: string }>(),
);

export const deleteCertificateFailure = createAction('[Certificate List] Delete Certificate Failure');

export const previewCertificate = createAction(
  '[Certificates List] Preview Certificate',
  props<{ certificate: CustomCertificateDto }>(),
);

export const toggleDefaultCertificate = createAction(
  '[Certificates List] Toggle Default Certificate',
  props<{ certificate: CustomCertificateDto }>(),
);

export const toggleDefaultCertificateSuccess = createAction('[Certificates List] Toggle Default Certificate Success');

export const toggleDefaultCertificateFailure = createAction('[Certificates List] Toggle Default Certificate Failure');

export const search = createAction('[Certificate List] Search', props<{ search: string }>());

export const setPagination = createAction(
  '[Certificate List] Set Pagination',
  props<{ pagination: Partial<CustomCertificatesFilter> }>(),
);

export const resetState = createAction('[Certificates List] Reset State');
