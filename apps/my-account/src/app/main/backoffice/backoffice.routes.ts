import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { canActivateAuthGuard } from '@keeps-platform-frontend-workspace/kp-keeps';
import { WorkspaceGuard } from 'app/shared/guard/workspace.guard';
import { BackofficeGuard } from './backoffice.guard';
import { ExternalProvidersComponent } from './external-providers/containers/external-providers/external-providers.component';
import { KeycloakComponent } from './keycloak';
import { TransferUserEnrollmentsComponent } from './transfer-user-enrollments/transfer-user-enrollments.component';
import { StoreModule } from '@ngrx/store';
import { externalProviderFeature } from './external-providers/store/features';
import { FEATURE_EP_EFFECTS } from './external-providers/store/effects';
import { EffectsModule } from '@ngrx/effects';

const EXTERNAL_PROVIDERS_PROVIDERS = [
  importProvidersFrom(StoreModule.forFeature(externalProviderFeature), EffectsModule.forFeature(FEATURE_EP_EFFECTS)),
];

export default [
  {
    path: 'keycloak',
    component: KeycloakComponent,
    canActivate: [canActivateAuthGuard, WorkspaceGuard, BackofficeGuard],
  },
  {
    path: 'transfer-user-enrollments',
    component: TransferUserEnrollmentsComponent,
    canActivate: [canActivateAuthGuard, WorkspaceGuard, BackofficeGuard],
  },
  {
    path: 'external-providers',
    component: ExternalProvidersComponent,
    providers: EXTERNAL_PROVIDERS_PROVIDERS,
    canActivate: [canActivateAuthGuard, WorkspaceGuard, BackofficeGuard],
  },
  {
    path: '**',
    redirectTo: 'keycloak',
  },
] as Routes;
