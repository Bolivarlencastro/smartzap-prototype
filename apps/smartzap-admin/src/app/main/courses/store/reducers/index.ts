import * as fromRoot from 'app/shared/store/reducers';
import * as fromCourses from './courses.reducer';
import * as fromCourse from './course.reducer';
import * as fromUpload from './upload.reducer';
import * as fromLessons from './lessons.reducer';
import * as fromEnrollments from './enrollments.reducer';
import * as fromTracking from './tracking.reducer';
import * as fromTransfer from './transfer.reducer';

import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

export const coursesFeatureKey = 'courses';

export interface CoursesState {
  [fromCourses.featureKey]: fromCourses.State;
  [fromCourse.featureKey]: fromCourse.State;
  [fromUpload.featureKey]: fromUpload.State;
  [fromLessons.featureKey]: fromLessons.State;
  [fromEnrollments.featureKey]: fromEnrollments.State;
  [fromTracking.featureKey]: fromTracking.State;
  [fromTransfer.featureKey]: fromTransfer.State;
}

export interface State extends fromRoot.State {
  [coursesFeatureKey]: CoursesState;
}

export function reducers(
  state: CoursesState | undefined,
  action: Action,
): {
  [fromCourses.featureKey]: fromCourses.State;
  [fromCourse.featureKey]: fromCourse.State;
  [fromUpload.featureKey]: fromUpload.State;
  [fromLessons.featureKey]: fromLessons.State;
  [fromEnrollments.featureKey]: fromEnrollments.State;
  [fromTracking.featureKey]: fromTracking.State;
  [fromTransfer.featureKey]: fromTransfer.State;
} {
  return combineReducers({
    [fromCourses.featureKey]: fromCourses.reducer,
    [fromCourse.featureKey]: fromCourse.reducer,
    [fromUpload.featureKey]: fromUpload.reducer,
    [fromLessons.featureKey]: fromLessons.reducer,
    [fromEnrollments.featureKey]: fromEnrollments.reducer,
    [fromTracking.featureKey]: fromTracking.reducer,
    [fromTransfer.featureKey]: fromTransfer.reducer,
  })(state, action);
}

export const selectCoursesFeatureState = createFeatureSelector<CoursesState>(coursesFeatureKey);
