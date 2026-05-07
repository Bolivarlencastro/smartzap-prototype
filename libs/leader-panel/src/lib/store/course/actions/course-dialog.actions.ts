import { createAction, props } from '@ngrx/store';
import { Course } from '../../../models/course';
import { CourseDialogData } from '../../../models/course-dialog';

const openDialog = createAction('[Course Dialog] Open Dialog', props<{ selectedCourse: Course }>());

const fetchData = createAction('[Course Dialog] Fetch Data');
const fetchDataSuccess = createAction('[Course Dialog] Fetch Data Success', props<{ data: CourseDialogData }>());
const fetchDataFailure = createAction('[Course Dialog] Fetch Data Failure');

const resetState = createAction('[Course Dialog] Reset State');

export const CourseDialogActions = {
  openDialog,
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
  resetState,
};
