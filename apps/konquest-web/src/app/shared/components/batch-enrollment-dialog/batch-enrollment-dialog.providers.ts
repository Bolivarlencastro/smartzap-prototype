import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BatchEnrollmentEffects } from './store/batch-enrollment.effects';
import { batchEnrollmentFeature } from './store/batch-enrollments.feature';
import { GenericErrorHandlerService } from '../generic-error-handler';

export const BATCH_ENROLLMENT_DIALOG_PROVIDERS = [
  GenericErrorHandlerService,
  importProvidersFrom(StoreModule.forFeature(batchEnrollmentFeature), EffectsModule.forFeature(BatchEnrollmentEffects)),
];
