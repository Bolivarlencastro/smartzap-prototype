import { Routes } from '@angular/router';
import { SettingsComponent, SettingsEnrollmentsComponent, SettingsGeneralComponent } from './containers';
import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromSettings from 'app/main/settings/store/reducers';
import { EnrollmentsEffects } from 'app/main/settings/store/effects';

export default [
  {
    path: 'configurations',
    component: SettingsGeneralComponent,
    providers: [
      importProvidersFrom(
        EffectsModule.forFeature(EnrollmentsEffects),
        StoreModule.forFeature(fromSettings.settingsFeatureKey, fromSettings.reducers),
      ),
    ],
  },
  {
    path: 'general',
    pathMatch: 'full',
    redirectTo: 'configurations',
  },
  {
    path: '',
    component: SettingsComponent,
    providers: [
      importProvidersFrom(
        EffectsModule.forFeature(EnrollmentsEffects),
        StoreModule.forFeature(fromSettings.settingsFeatureKey, fromSettings.reducers),
      ),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'enrollments',
      },
      {
        path: 'enrollments',
        component: SettingsEnrollmentsComponent,
      },
      {
        path: '**',
        redirectTo: 'enrollments',
      },
    ],
  },
] as Routes;
