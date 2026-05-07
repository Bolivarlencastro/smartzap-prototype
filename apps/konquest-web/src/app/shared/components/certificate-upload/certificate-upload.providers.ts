import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CertificateUploadEffects, certificateUploadFeature } from './store';

export const CERTIFICATE_UPLOAD_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(certificateUploadFeature),
    EffectsModule.forFeature([CertificateUploadEffects]),
  ),
];
