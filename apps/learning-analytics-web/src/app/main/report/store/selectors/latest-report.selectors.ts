import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromStore from '../reducers';
import * as fromLatestReports from '../reducers/latest-report.reducers';

export const selectLatestReportState = createSelector(fromStore.selectReportsState, (state) => state.latestReports);

createFeatureSelector<fromStore.ReportsState>(fromLatestReports.featureKey);

export const selectLatestReports = createSelector(selectLatestReportState, fromLatestReports.selectAll);

export const selectIsLoading = createSelector(selectLatestReportState, (state) => {
  return state.loading;
});

export const selectFilter = createSelector(selectLatestReportState, (state) => {
  return state.filter;
});

export const selectIsLastPage = createSelector(selectLatestReportState, (state) => {
  return state.totalPages === state.filter.page;
});
