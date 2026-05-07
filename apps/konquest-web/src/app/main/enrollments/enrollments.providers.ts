import { EnrollmentsService } from './services/enrollments.service';
import { MISSION_ENROLLMENTS_PROVIDERS } from '@app/main/mission-enrollments/mission-enrollments.providers';
import { TRAILS_ENROLLMENTS_PROVIDERS } from 'app/main/learning-trail-enrollments/learning-trail-enrollments.providers';
import { ENROLLMENTS_FILTER_PROVIDERS } from 'app/shared/components/enrollments-filter';

export const USER_ENROLLMENTS_LIST_PROVIDERS = [
  EnrollmentsService,
  ...ENROLLMENTS_FILTER_PROVIDERS,
  ...MISSION_ENROLLMENTS_PROVIDERS,
  ...TRAILS_ENROLLMENTS_PROVIDERS,
];
