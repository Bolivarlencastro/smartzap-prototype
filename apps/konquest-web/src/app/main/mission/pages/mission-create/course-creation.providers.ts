import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideNgxMask } from 'ngx-mask';
import { FEATURE_SERVICES } from './services';
import { FEATURE_EFFECTS, missionCreateFeatureKey, missionCreateReducer, supportMaterialsFeature } from './store';

export const COURSE_CREATION_PROVIDERS = [
  importProvidersFrom(
    EffectsModule.forFeature(FEATURE_EFFECTS),
    StoreModule.forFeature(missionCreateFeatureKey, missionCreateReducer),
    StoreModule.forFeature(supportMaterialsFeature),
  ),
  ...FEATURE_SERVICES,
  provideNgxMask(),
];
