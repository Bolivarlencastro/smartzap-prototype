import { createAction, props } from '@ngrx/store';
import { Course } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FinishEnrollmentResult } from '../../models';

export const loadCourse = createAction(
  '[Classroom Course] Load Course',
  props<{ courseId: string; rollbackPath?: string; isViewingAsUser?: boolean }>(),
);

export const loadCourseSuccess = createAction('[Classroom Course] Load Course Success', props<{ course: Course }>());

export const loadCourseFailure = createAction('[Classroom Course] Load Course Failure', props<{ error: unknown }>());

export const loadGamification = createAction(
  '[Classroom Course] Load Gamification',
  props<{ hasGamification: boolean }>(),
);

export const openLeaveConfirmationDialog = createAction('[Classroom Course] Open Leave Confirmation Dialog');

export const leaveCourse = createAction('[Classroom Course] Leave Course');

export const navigateToCertificate = createAction('[Classroom Course] Navigate to Certificate');

export const updateGoalDate = createAction('[Classroom Course] Update Goal Date', props<{ date: Date }>());

export const updateGoalDateSuccess = createAction(
  '[Classroom Course] Update Goal Date Success',
  props<{ date: Date }>(),
);

export const toggleGoalDateMenu = createAction('[Classroom Course] Toggle Goal Date Menu', props<{ value: boolean }>());

export const openFinishCourseConfirmationDialog = createAction('[Classroom Course] Open Finish Confirmation Dialog');

export const finishCourse = createAction('[Classroom Course] Finish Course');

export const finishCourseSuccess = createAction(
  '[Classroom Course] Finish Course Success',
  props<{ enrollmentResult: FinishEnrollmentResult; course: Course; hasGamification: boolean }>(),
);

export const finishCourseFailure = createAction('[Classroom Course] Finish Course Failure', props<{ error: Error }>());

export const loadCertificate = createAction('[Classroom Course] Load Certificate');

export const loadCertificateSuccess = createAction(
  '[Classroom Course] Load Certificate Success',
  props<{
    certificateUrl: string;
  }>(),
);

export const loadCertificateFailure = createAction(
  '[Classroom Course] Load Certificate Failure',
  props<{ error: Error }>(),
);

export const shareCertificate = createAction('[Classroom Course] Share Certificate');

export const reset = createAction('[Classroom Course] Reset State');
