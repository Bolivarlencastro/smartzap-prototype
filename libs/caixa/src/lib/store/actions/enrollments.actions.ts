import { createAction, props } from '@ngrx/store';
import { CaixaSmartZapCourseEnrollmentDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadEnrollments = createAction('[Enrollments] Load Enrollments', props<{ userId: string }>());

export const loadEnrollmentsSuccess = createAction(
  '[Enrollments] Load Enrollments Success',
  props<{ enrollments: CaixaSmartZapCourseEnrollmentDto[] }>(),
);

export const loadEnrollmentsFailure = createAction(
  '[Enrollments] Load Enrollments Failure',
  props<{ error: unknown }>(),
);

export const reset = createAction('[Enrollments] Reset Enrollments');
