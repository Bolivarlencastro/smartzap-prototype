import { createSelector } from '@ngrx/store';
import { ReportType } from '../../enums/report';
import * as fromStore from '../reducers';
import * as fromSimpleFilterReport from '../reducers/simple-filter-report.reducer';

const { selectAll } = fromSimpleFilterReport.adapter.getSelectors();

export const selectSimpleFilterReportState = createSelector(
  fromStore.selectReportsState,
  (state) => state.simpleFilterReport,
);

export const selectIsLoading = createSelector(selectSimpleFilterReportState, (state) => state.loading);
export const selectItems = createSelector(selectSimpleFilterReportState, selectAll);
export const selectFilter = createSelector(selectSimpleFilterReportState, (state) => state.filter);
export const selectLoaded = createSelector(selectSimpleFilterReportState, (state) => state.loaded);
export const selectMultiple = createSelector(selectSimpleFilterReportState, (state) => {
  const selectReportType = state.filter.reportType;
  return selectReportType !== ReportType.COURSE_OVERVIEW && selectReportType !== ReportType.USER_OVERVIEW;
});
export const selectHasNoItems = createSelector(
  selectSimpleFilterReportState,
  (state) => state.loaded && !state.ids.length && !state.loading,
);
