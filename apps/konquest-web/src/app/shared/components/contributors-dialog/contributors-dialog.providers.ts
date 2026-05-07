import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { ContributorsEffects, contributorsFeature } from './store';
import { EffectsModule } from '@ngrx/effects';

export const CONTRIBUTORS_DIALOG_PROVIDERS = [
  importProvidersFrom(StoreModule.forFeature(contributorsFeature), EffectsModule.forFeature([ContributorsEffects])),
];
