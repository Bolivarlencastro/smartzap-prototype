import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GenericErrorHandlerService } from 'app/shared/components/generic-error-handler';
import { GroupLearningTrailEffects } from './store/group-learning-trail.effects';
import * as fromGroupLearningTrail from './store/group-learning-trail.reducer';
import { GroupLearningTrailAPI } from './group-learning-trail.api';

export const GROUP_LEARNING_TRAIL_PROVIDERS = [
  importProvidersFrom(
    EffectsModule.forFeature([GroupLearningTrailEffects]),
    StoreModule.forFeature(fromGroupLearningTrail.groupLearningTrailsFeatureKey, fromGroupLearningTrail.reducer),
  ),
  GroupLearningTrailAPI,
  GenericErrorHandlerService,
];
