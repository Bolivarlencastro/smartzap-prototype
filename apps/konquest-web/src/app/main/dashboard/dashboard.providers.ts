import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { DASHBOARD_FEATURE_EFFECTS, dashboardFeature } from 'app/main/dashboard/store';
import { EffectsModule } from '@ngrx/effects';

export const DASHBOARD_PROVIDERS = [
  importProvidersFrom(StoreModule.forFeature(dashboardFeature), EffectsModule.forFeature(DASHBOARD_FEATURE_EFFECTS)),
];
