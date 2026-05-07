import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MissionEnrollmentsState, missionsDoneKey } from './mission-enrollments.reducer';

export const selectEnrollmentsState = createFeatureSelector<MissionEnrollmentsState>(missionsDoneKey);

export const selectEnrollments = createSelector(
  selectEnrollmentsState,
  (state: MissionEnrollmentsState) => state.enrollments,
);

export const selectFilter = createSelector(selectEnrollmentsState, (state: MissionEnrollmentsState) => state.filter);

export const selectIsLoading = createSelector(
  selectEnrollmentsState,
  (state: MissionEnrollmentsState) => state.isLoading,
);

export const selectHistory = createSelector(selectEnrollmentsState, (state: MissionEnrollmentsState) => state.history);

export const selectCurrentPage = createSelector(selectFilter, (filter) => Math.max((filter?.page || 0) - 1, 0));

export const selectPerPage = createSelector(selectFilter, (filter) => filter.per_page);

export const selectFilterByAllUsers = createSelector(
  selectEnrollmentsState,
  (state: MissionEnrollmentsState) => state.filteringAllUsers,
);

export const selectCount = createSelector(selectEnrollmentsState, (state: MissionEnrollmentsState) => state.count);

export const selectSort = createSelector(selectEnrollmentsState, (state: MissionEnrollmentsState) => state.sort);

export const selectIsFinished = createSelector(
  selectEnrollmentsState,
  (state: MissionEnrollmentsState) => state.isFinished,
);

export const selectStatuses = createSelector(
  selectEnrollmentsState,
  (state: MissionEnrollmentsState) => state.statuses,
);

export const selectHasAppliedFilter = createSelector(
  selectFilter,
  (filter) =>
    !!filter?.performance__gte ||
    !!filter?.performance__lte ||
    !!filter?.start_date__gte ||
    !!filter?.start_date__lte ||
    !!filter?.end_date__gte ||
    !!filter?.end_date__lte ||
    !!filter?.status?.length,
);

export const selectIsCourse = createSelector(
  selectEnrollmentsState,
  (state: MissionEnrollmentsState) => state.isCourse,
);

export const selectIsContentCreator = createSelector(
  selectEnrollmentsState,
  (state: MissionEnrollmentsState) => state.isContentCreator,
);
