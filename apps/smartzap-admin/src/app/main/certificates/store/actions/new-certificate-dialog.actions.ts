import { createAction, props } from '@ngrx/store';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CertificateImageDefinition } from '../../model';

export const openNewCertificateDialog = createAction('[New Certificate Dialog] Open New Certificate Dialog');

export const openEditCertificateDialog = createAction(
  '[New Certificate Dialog] Open Edit Certificate Dialog',
  props<{ certificate: CustomCertificateDto }>(),
);

export const dialogClosed = createAction('[New Certificate Dialog] Dialog Closed');

export const saveCertificate = createAction(
  '[New Certificate Dialog] Save Certificate',
  props<{ certificate: CustomCertificateDto }>(),
);

export const saveCertificateSuccess = createAction(
  '[New Certificate Dialog] Save Certificate Success',
  props<{ certificate: CustomCertificateDto }>(),
);

export const saveCertificateFailure = createAction('[New Certificate Dialog] Save Certificate Failure');

export const setImage = createAction(
  '[New Certificate Dialog] Set Image',
  props<{ image: File; imageDef: CertificateImageDefinition }>(),
);

export const resetState = createAction('[New Certificate Dialog] Reset State');
