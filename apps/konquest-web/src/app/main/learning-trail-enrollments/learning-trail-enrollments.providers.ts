import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LINK_CYCLE_DIALOG_PROVIDERS } from '../link-cycle-dialog/link-cycle-dialog.providers';
import { LearningTrailEnrollmentsService } from './learning-trail-enrollments.service';
import { LearningTrailEnrollmentsEffects } from './store/learning-trail-enrollments.effects';
import * as fromEnrollments from './store/learning-trail-enrollments.reducer';
import { provideNgxMask } from 'ngx-mask';

export const TRAILS_ENROLLMENTS_PROVIDERS = [
  LearningTrailEnrollmentsService,
  provideNgxMask(),
  importProvidersFrom(
    EffectsModule.forFeature([LearningTrailEnrollmentsEffects]),
    StoreModule.forFeature(fromEnrollments.learningTrailDoneKey, fromEnrollments.reducer),
  ),
  ...LINK_CYCLE_DIALOG_PROVIDERS,
];
