import { CourseListEffects } from './course-list.effects';
import { CourseEnrollmentEffects } from './course-enrollment.effects';
import { UserRegistrationEffects } from './user-registration.effects';
import { LoginEffects } from './login.effects';
import { EnrollmentsEffects } from './enrollments.effects';
import { PartnerSelectionEffects } from './partner-selection.effects';

export const FEATURE_EFFECTS = [
  CourseListEffects,
  CourseEnrollmentEffects,
  UserRegistrationEffects,
  LoginEffects,
  EnrollmentsEffects,
  PartnerSelectionEffects,
];
