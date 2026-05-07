import { CaixaSmartZapUser } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';
import { CourseEnrollmentData, EnrollmentResult } from '../../models';

export const openDialog = createAction('[Course Enrollment] Open Dialog', props<{ courseId: string }>());

export const redirectToWhatsApp = createAction('[Course Enrollment] Redirect To WhatsApp');

export const redirectToSupportWhatsApp = createAction('[Course Enrollment] Redirect To Support WhatsApp');

export const enroll = createAction(
  '[Course Enrollment] Enroll',
  props<{
    courseEnrollmentData: CourseEnrollmentData;
  }>(),
);

export const enrollFailure = createAction('[Course Enrollment] Enroll Failure', props<{ error: unknown }>());

export const enrollSuccess = createAction('[Course Enrollment] Enroll Success');

export const openEnrollmentResultDialog = createAction(
  '[Course Enrollment] Open Enrollment Result Dialog',
  props<{ result: EnrollmentResult; selectedUser?: CaixaSmartZapUser; courseId?: string }>(),
);

export const reset = createAction('[Course Enrollment] Reset');

export const cancelCurrentAndEnrollIntoCourse = createAction(
  '[Course Enrollment] Cancel User Enrollment',
  props<{
    userId: string;
    courseId: string;
  }>(),
);

export const openEnrollmentCancelConfirmationDialog = createAction(
  '[Course Enrollment] Open Enrollment Cancel Confirmation Dialog',
);

export const cancelEnrollmentSuccess = createAction('[Course Enrollment] Cancel Course Enrollment Success');

export const cancelUserEnrollmentFailure = createAction(
  '[Course Enrollment] Cancel User Enrollment Failure',
  props<{ error: unknown }>(),
);
