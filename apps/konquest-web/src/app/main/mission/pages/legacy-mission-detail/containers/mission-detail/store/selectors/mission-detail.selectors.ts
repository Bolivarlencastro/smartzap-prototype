import { createSelector } from '@ngrx/store';
import { MissionDetailReducers, MissionDetailsState, selectMissionDetailFeatureState } from '../reducers';
import { EvaluationSummary } from '@core/model/evaluation.model';

export const selectMission = createSelector(
  selectMissionDetailFeatureState,
  (state: MissionDetailsState) => state?.mission,
);

export const selectCourse = createSelector(selectMission, (state: MissionDetailReducers.State) => state?.course);

export const selectEvaluations = createSelector(selectMission, (state) => state?.evaluations);

export const selectEvaluationSummary = createSelector(selectMission, (state) => {
  const summary = state?.summary ?? ({} as EvaluationSummary);
  return {
    ...summary,
    nps: {
      value: summary.nps?.value ?? 0,
      count_by_point: summary.nps?.count_by_point ?? {},
      promoters: {
        percentage: summary.nps?.promoters.percentage,
        count: summary.nps?.promoters.count ?? 0,
      },
      neutrals: {
        percentage: summary.nps?.neutrals.percentage,
        count: summary.nps?.neutrals.count ?? 0,
      },
      detractors: {
        percentage: summary.nps?.detractors.percentage,
        count: summary.nps?.detractors.count ?? 0,
      },
    },
  };
});

export const selectEvaluationQuestions = createSelector(selectMission, (state) => state?.questions);

export const selectIsLoading = createSelector(selectMission, (state) => state?.loadingEvaluation);

export const selectCourseEvaluationFilter = createSelector(selectMission, (state) => state?.courseEvaluationFilter);
