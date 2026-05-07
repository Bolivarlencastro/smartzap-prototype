import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { certificatesListFeature, newCertificateDialogFeature } from './store/features';
import { StoreModule } from '@ngrx/store';
import { FEATURE_EFFECTS } from './store/effects';
import { EffectsModule } from '@ngrx/effects';
import { TranslocoModule } from '@jsverse/transloco';
import { getTranslocoScope } from './transloco-scope.factory';
import { CertificateLearnContentFacade, CertificatesListFacade, NewCertificateDialogFacade } from './facades';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    StoreModule.forFeature(certificatesListFeature),
    StoreModule.forFeature(newCertificateDialogFeature),
    EffectsModule.forFeature(FEATURE_EFFECTS),
  ],
  providers: [getTranslocoScope(), NewCertificateDialogFacade, CertificatesListFacade, CertificateLearnContentFacade],
})
export class CustomCertificatesModule {}
