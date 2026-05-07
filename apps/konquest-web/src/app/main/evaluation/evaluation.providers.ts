import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CourseEvaluationEffects, CourseEvaluationReducer } from 'app/main/evaluation/store';

export const EVALUATION_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(
      CourseEvaluationReducer.courseEvaluationFeatureKey,
      CourseEvaluationReducer.courseEvaluationReducers,
    ),
    EffectsModule.forFeature([CourseEvaluationEffects]),
  ),
];
