import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CertificatesComponent } from './containers/certificates.component';
import { certificatesListFeature } from './store/features/certificates-list.feature';
import { newCertificateDialogFeature } from './store/features/new-certificate-dialog.feature';
import { FEATURE_EFFECTS } from './store/effects';
import { CertificatesListFacade } from './facades/certificates-list.facade';
import { NewCertificateDialogFacade } from './facades/new-certificate-dialog.facade';

export default [
  {
    path: '',
    component: CertificatesComponent,
    providers: [
      importProvidersFrom(
        StoreModule.forFeature(certificatesListFeature),
        StoreModule.forFeature(newCertificateDialogFeature),
        EffectsModule.forFeature(FEATURE_EFFECTS),
      ),
      CertificatesListFacade,
      NewCertificateDialogFacade,
    ],
  },
] as Routes;
