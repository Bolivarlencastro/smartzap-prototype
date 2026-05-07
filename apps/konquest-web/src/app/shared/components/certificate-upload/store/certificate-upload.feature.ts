import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as CertificateUploadActions from './certificate-upload.actions';

export interface CertificateUploadFeatureState {
  enrollmentId: string | undefined;
  certificateHistory: string | undefined;
  uploadInProgress: boolean;
}

export const certificateUploadFeatureInitialState: CertificateUploadFeatureState = {
  enrollmentId: undefined,
  certificateHistory: undefined,
  uploadInProgress: false,
};

const featureReducer = createReducer(
  certificateUploadFeatureInitialState,
  on(
    CertificateUploadActions.openDialog,
    (state, { enrollmentId }): CertificateUploadFeatureState => ({
      ...state,
      enrollmentId,
    }),
  ),

  on(
    CertificateUploadActions.loadCertificateHistorySuccess,
    (state, { history }): CertificateUploadFeatureState => ({
      ...state,
      certificateHistory: history,
    }),
  ),

  on(
    CertificateUploadActions.uploadCertificate,
    (state): CertificateUploadFeatureState => ({
      ...state,
      uploadInProgress: true,
    }),
  ),

  on(
    CertificateUploadActions.uploadCertificateFailure,
    (state): CertificateUploadFeatureState => ({
      ...state,
      uploadInProgress: false,
    }),
  ),

  on(
    CertificateUploadActions.openDialog,
    (state, { enrollmentId }): CertificateUploadFeatureState => ({
      ...state,
      enrollmentId,
    }),
  ),

  on(CertificateUploadActions.resetState, (): CertificateUploadFeatureState => certificateUploadFeatureInitialState),
);

export const certificateUploadFeature = createFeature({
  name: 'certificateUpload',
  reducer: featureReducer,
  extraSelectors: ({ selectUploadInProgress }) => ({
    selectUploadDisabled: createSelector(selectUploadInProgress, (uploadInProgress) => uploadInProgress),
  }),
});
