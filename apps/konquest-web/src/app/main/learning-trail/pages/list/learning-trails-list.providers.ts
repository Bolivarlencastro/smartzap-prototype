import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CollectionEffects, RecommendationsEffects } from './store/effects';
import { learningTrailsListFeatureKey, reducers } from './store/reducers';

export const LEARNING_TRAIL_LIST_PROVIDERS = [
  importProvidersFrom(
    EffectsModule.forFeature([CollectionEffects, RecommendationsEffects]),
    StoreModule.forFeature(learningTrailsListFeatureKey, reducers),
  ),
];
