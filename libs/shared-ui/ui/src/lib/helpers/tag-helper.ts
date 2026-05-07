import { differenceInDays, endOfToday, format, formatDistanceToNowStrict } from 'date-fns';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CardTagType, LearnContentCardTag } from '../models';

export const ENROLLMENT_STATUS_TAG_TYPE_MAP = new Map<EnrollmentStatuses, CardTagType>([
  [EnrollmentStatuses.ENROLLED, 'enrollment-enrolled'],
  [EnrollmentStatuses.STARTED, 'enrollment-started'],
  [EnrollmentStatuses.EXPIRED, 'enrollment-expired'],
  [EnrollmentStatuses.REQUEST_EXTENSION, 'enrollment-required-new-deadline'],
  [EnrollmentStatuses.COMPLETED, 'enrollment-finished'],
  [EnrollmentStatuses.PENDING_VALIDATION, 'enrollment-awaiting-certificate-approval'],
  [EnrollmentStatuses.ENROLLMENT_REPROVED, 'enrollment-certificate-reproved'],
  [EnrollmentStatuses.REPROVED, 'enrollment-certificate-reproved'],
  [EnrollmentStatuses.GIVE_UP, 'enrollment-give-up'],
  [EnrollmentStatuses.INACTIVATED, 'enrollment-inactive'],
  [EnrollmentStatuses.REFUSED, 'enrollment-refused'],
  [EnrollmentStatuses.WAITING, 'enrollment-awaiting-confirmation'],
]);

export const DEVELOPMENT_STATUS_TAG_TYPE_MAP = new Map<DevelopmentStatus, CardTagType>([
  [DevelopmentStatus.IN_PROGRESS, 'development-creating'],
  [DevelopmentStatus.PROCESSING, 'development-processing'],
  [DevelopmentStatus.IN_REVIEW, 'development-awaiting-review'],
  [DevelopmentStatus.DONE, 'development-published'],
  [DevelopmentStatus.INACTIVATED, 'development-inactive'],
  [DevelopmentStatus.CLOSED, 'development-finished-event'],
  [DevelopmentStatus.INACTIVATED_BY_INTEGRATION, 'development-inactive-by-integration'],
]);

export function createEnrollmentInfoTag(
  enrollmentStatus: EnrollmentStatuses,
  goalDate: string,
): LearnContentCardTag | undefined {
  const shouldDisplayEnrollmentGoalTag =
    enrollmentStatus !== EnrollmentStatuses.INACTIVATED &&
    enrollmentStatus !== EnrollmentStatuses.REPROVED &&
    enrollmentStatus !== EnrollmentStatuses.COMPLETED &&
    enrollmentStatus !== EnrollmentStatuses.PENDING_VALIDATION;

  if (!shouldDisplayEnrollmentGoalTag || !goalDate) {
    return undefined;
  }

  const expirationDate = new Date(`${goalDate}T00:00:00`);
  const daysUntilExpiration = differenceInDays(expirationDate, endOfToday());

  if (daysUntilExpiration > 6) {
    return { type: 'goal-to', label: format(expirationDate, 'P') };
  }

  if (daysUntilExpiration < 0) {
    return { type: 'goal-due-by', label: formatDistanceToNowStrict(expirationDate) };
  }

  return { type: 'goal-expires-in', label: formatDistanceToNowStrict(expirationDate) };
}
