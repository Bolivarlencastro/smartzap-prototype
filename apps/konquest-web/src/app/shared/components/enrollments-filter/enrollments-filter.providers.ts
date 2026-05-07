import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { EnrollmentsFilterEffects, enrollmentsFilterFeature } from 'app/shared/components/enrollments-filter/store';
import { StoreModule } from '@ngrx/store';

export const ENROLLMENTS_FILTER_PROVIDERS = [
  importProvidersFrom(
    EffectsModule.forFeature([EnrollmentsFilterEffects]),
    StoreModule.forFeature(enrollmentsFilterFeature),
  ),
];
