import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourseEvaluationReducer } from '../reducers';

const selectCourseEvaluationState = createFeatureSelector<CourseEvaluationReducer.State>(
  CourseEvaluationReducer.courseEvaluationFeatureKey,
);

export const selectEvaluations = createSelector(selectCourseEvaluationState, (state) => state?.evaluations);

export const selectEvaluationQuestions = createSelector(selectCourseEvaluationState, (state) => state?.questions);

export const selectIsLoading = createSelector(selectCourseEvaluationState, (state) => state?.isLoading);

export const selectMissionId = createSelector(selectCourseEvaluationState, (state) => state?.missionId);

export const selectIsExternalMission = createSelector(selectCourseEvaluationState, (state) => state?.isExternalMission);

export const selectEnrollmentId = createSelector(selectCourseEvaluationState, (state) => state?.enrollmentId);
