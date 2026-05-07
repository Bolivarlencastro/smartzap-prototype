import { createSelector } from '@ngrx/store';
import { CoursesState, selectCoursesFeatureState } from '../reducers';
import * as fromDetail from '../reducers/course.reducer';

export const selectDetailState = createSelector(selectCoursesFeatureState, (state: CoursesState) => state?.course);

export const selectCourse = createSelector(selectDetailState, (state: fromDetail.State) => state?.course);

export const selectCourseId = createSelector(selectCourse, (course) => course.id);

export const selectIsLoading = createSelector(selectDetailState, (state) => state?.isLoading);

export const selectIsLoaded = createSelector(selectDetailState, (state) => state?.isLoaded);

export const selectIsInformationFormCompleted = createSelector(selectDetailState, (state) => !!state?.course.id);

export const selectIsNotProcessing = createSelector(
  selectDetailState,
  (state) => state?.course.status !== 'PROCESSING',
);

export const selectCourseFinished = createSelector(selectDetailState, (state) => state?.course.status === 'FINISHED');

export const selectIsOwner = createSelector(selectDetailState, (state) => state?.isOwner);

export const selectGetReportButtons = createSelector(selectDetailState, (state) => state?.reportButtons);
