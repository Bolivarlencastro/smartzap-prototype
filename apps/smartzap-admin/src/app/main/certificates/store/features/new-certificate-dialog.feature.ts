import { createFeature, createReducer, on } from '@ngrx/store';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { NewCertificateDialogActions } from '../actions';

export interface NewCertificateDialogFeatureState {
  certificate: CustomCertificateDto | undefined;
  isSaving: boolean;
}

const initialState: NewCertificateDialogFeatureState = {
  certificate: undefined,
  isSaving: false,
};

const reducer = createReducer(
  initialState,

  on(NewCertificateDialogActions.openNewCertificateDialog, (state): NewCertificateDialogFeatureState => ({ ...state })),

  on(
    NewCertificateDialogActions.openEditCertificateDialog,
    (state, { certificate }): NewCertificateDialogFeatureState => ({ ...state, certificate }),
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
    (state): NewCertificateDialogFeatureState => ({ ...state, isSaving: false }),
  ),

  on(NewCertificateDialogActions.resetState, (): NewCertificateDialogFeatureState => initialState),
);

export const newCertificateDialogFeature = createFeature({
  name: 'newCertificateDialogFeature',
  reducer,
});
