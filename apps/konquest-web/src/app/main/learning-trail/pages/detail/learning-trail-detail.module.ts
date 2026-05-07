import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LearningTrailDetailLoadingEffects } from './store/learning-trail-detail-loading.effects';
import { LearningTrailDetailEffects } from './store/learning-trail-detail.effects';
import { featureKey, reducer } from './store/learning-trail-detail.reducer';
import { TRANSFER_DIALOG_PROVIDERS } from 'app/main/transfer-dialog';

export const LEARNING_TRAIL_DETAIL_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([LearningTrailDetailEffects, LearningTrailDetailLoadingEffects]),
  ),
  ...TRANSFER_DIALOG_PROVIDERS,
];
