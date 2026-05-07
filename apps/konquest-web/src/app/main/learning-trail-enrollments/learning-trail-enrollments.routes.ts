import { Routes } from '@angular/router';
import { LearningTrailEnrollmentsComponent } from './learning-trail-enrollments.component';
import { TRAILS_ENROLLMENTS_PROVIDERS } from './learning-trail-enrollments.providers';
import { ENROLLMENTS_FILTER_PROVIDERS } from 'app/shared/components/enrollments-filter';

export default [
  {
    path: '',
    component: LearningTrailEnrollmentsComponent,
    providers: [...TRAILS_ENROLLMENTS_PROVIDERS, ...ENROLLMENTS_FILTER_PROVIDERS],
  },
] as Routes;
