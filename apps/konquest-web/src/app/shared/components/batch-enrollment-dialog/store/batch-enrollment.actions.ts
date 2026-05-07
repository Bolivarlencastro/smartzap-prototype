import { createAction, props } from '@ngrx/store';
import { BatchEnrollmentType } from 'app/shared/services/batch-enrollment.service';
import { User } from '@core/model';
import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { BatchEnrollmentViewMode } from 'app/shared/components/batch-enrollment-dialog/models';
import { BasicUserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

export const openDialog = createAction(
  '[Mission Batch Enrollment] Open Batch Enrollments Dialog',
  props<{ learningContentId: string; enrollmentType: BatchEnrollmentType; remainingSeats?: number }>(),
);

export const changeViewMode = createAction(
  '[Mission Batch Enrollment] Change View Mode',
  props<{
    viewMode: BatchEnrollmentViewMode;
  }>(),
);

export const batchEnrollmentFinished = createAction(
  '[Mission Batch Enrollment] Batch Enrollment Finished',
  props<{ learningContentId: string; enrollmentType: BatchEnrollmentType }>(),
);

export const submitForm = createAction(
  '[Mission Batch Enrollment] Batch Enroll Submit Form',
  props<{ goalDate: string }>(),
);

export const batchEnrollment = createAction('[Mission Batch Enrollment] Batch Enroll Users');

export const batchEnrollmentSuccess = createAction(
  '[Mission Batch Enrollment] Batch Enrollment Success',
  props<{
    enrollmentErrors: number;
  }>(),
);

export const batchEnrollmentFailure = createAction(
  '[Mission Batch Enrollment] Batch Enrollment Failure',
  props<{ error: Error }>(),
);

export const loadUsers = createAction('[Mission Batch Enrollment] Load Users');

export const loadMoreUsers = createAction('[Mission Batch Enrollment] Load More Users');

export const filterUsers = createAction('[Mission Batch Enrollment] Filter Users', props<{ filter: string }>());

export const loadUsersSuccess = createAction(
  '[Mission Batch Enrollment] Load Users Success',
  props<{ results: BasicUserProfile[]; totalItems: number; isFinished: boolean; concatResults: boolean }>(),
);

export const loadUsersFailure = createAction('[Mission Batch Enrollment] Load Users Failure');

export const parseUsers = createAction('[Mission Batch Enrollment] Parse Users', props<{ file: File }>());

export const parseUsersSuccess = createAction(
  '[Mission Batch Enrollment] Parse Users Success',
  props<{ users: User[]; notFounds: string[] }>(),
);

export const parseUsersFailure = createAction(
  '[Mission Batch Enrollment] Parse Users Failure',
  props<{ error: Error }>(),
);

export const backToEnrollList = createAction('[Mission Batch Enrollment] Return to Enrollment List');

export const resetState = createAction('[Mission Batch Enrollment] Reset State');

export const toggleSelectUser = createAction(
  '[Mission Batch Enrollment] Toggle User Selection',
  props<{
    id: string;
  }>(),
);

export const toggleSelectAll = createAction(
  '[Mission Batch Enrollment] Toggle All User Selection',
  props<{
    selected: boolean;
  }>(),
);

export const setSelection = createAction(
  '[Mission Batch Enrollment] Set User Selection',
  props<{
    selectedIds: Record<string, string>;
  }>(),
);

export const addToSelection = createAction(
  '[Mission Batch Enrollment] Add To User Selection',
  props<{
    ids: Record<string, string>;
  }>(),
);

export const setEnrollmentConfig = createAction(
  '[Mission Batch Enrollment] Set Enrollment Config',
  props<{ config: EnrollmentConfig }>(),
);
