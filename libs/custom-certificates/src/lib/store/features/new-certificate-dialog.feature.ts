import { createFeature, createReducer, on } from '@ngrx/store';
import { NewCertificateDialogActions } from '../actions';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface NewCertificateDialogFeatureState {
  certificate: CustomCertificateDto | undefined;
  isSaving: boolean;
}

export const certificateCreateInitialState: NewCertificateDialogFeatureState = {
  certificate: undefined,
  isSaving: false,
};

const reducer = createReducer(
  certificateCreateInitialState,

  on(NewCertificateDialogActions.openNewCertificateDialog, (state): NewCertificateDialogFeatureState => ({ ...state })),

  on(
    NewCertificateDialogActions.openEditCertificateDialog,
    (state, { certificate }): NewCertificateDialogFeatureState => ({
      ...state,
      certificate,
    }),
  ),

  on(
    NewCertificateDialogActions.saveCertificate,
    (state): NewCertificateDialogFeatureState => ({
      ...state,
      isSaving: true,
    }),
  ),

  on(
    NewCertificateDialogActions.saveCertificateSuccess,
    NewCertificateDialogActions.saveCertificateFailure,
    (state): NewCertificateDialogFeatureState => ({
      ...state,
      isSaving: false,
    }),
  ),

  on(NewCertificateDialogActions.resetState, (): NewCertificateDialogFeatureState => certificateCreateInitialState),
);

export const newCertificateDialogFeature = createFeature({
  name: 'newCertificateDialogFeature',
  reducer,
});
