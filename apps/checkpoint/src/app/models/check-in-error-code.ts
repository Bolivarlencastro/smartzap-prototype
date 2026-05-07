export type CHECK_IN_ERROR_CODE =
  | 'date_not_found'
  | 'enrollment_not_found_for_user_and_date'
  | 'date_expired_for_auto_check';

export type CHECK_IN_STATUS = CHECK_IN_ERROR_CODE | 'success' | 'loading';
