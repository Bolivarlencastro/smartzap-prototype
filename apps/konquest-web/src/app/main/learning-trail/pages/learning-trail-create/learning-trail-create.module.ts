import { importProvidersFrom, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LEARNING_TRAIL_FEATURE_EFFECTS } from './store';
import { learningTrailInfoFeature } from './store/features/learning-trail-info.feature';
import { learningTrailCreateFeature } from './store/features/learning-trail-create.feature';

export const LEARNING_TRAIL_CREATE_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(learningTrailInfoFeature),
    StoreModule.forFeature(learningTrailCreateFeature),
    EffectsModule.forFeature(LEARNING_TRAIL_FEATURE_EFFECTS),
  ),
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(learningTrailInfoFeature),
    StoreModule.forFeature(learningTrailCreateFeature),
    EffectsModule.forFeature(LEARNING_TRAIL_FEATURE_EFFECTS),
  ],
})
export class LearningTrailCreateModuleV2 {}
