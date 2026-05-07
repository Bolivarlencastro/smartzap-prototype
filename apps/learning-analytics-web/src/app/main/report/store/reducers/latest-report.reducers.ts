import { Report } from '@core/api/model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { LatestReportActions } from '../actions';
import { LatestReportFilter } from '../../interfaces';

export const featureKey = 'latestReports';

export interface State extends EntityState<Report> {
  loading: boolean;
  totalPages: number | undefined;
  filter: LatestReportFilter;
}

export const latestReportAdapter: EntityAdapter<Report> = createEntityAdapter<Report>({
  selectId: (reportResult) => reportResult.id,
});

const initialFilter: LatestReportFilter = {
  page: 1,
};

export const initialLatestReportState: State = latestReportAdapter.getInitialState({
  loading: false,
  totalPages: undefined,
  filter: initialFilter,
});

export const reducer = createReducer(
  initialLatestReportState,
  on(LatestReportActions.loadLatestReports, (state, { filter }): State => {
    return latestReportAdapter.removeAll({ ...state, loading: true, filter });
  }),
  on(LatestReportActions.loadLatestReportsSuccess, (state, { result, total_pages }): State => {
    return latestReportAdapter.setAll(result, {
      ...state,
      loading: false,
      totalPages: total_pages,
    });
  }),
  on(LatestReportActions.loadMoreLatestReports, (state, { filter }): State => {
    return { ...state, loading: true, filter };
  }),
  on(LatestReportActions.loadMoreLatestReportsSuccess, (state, { result }): State => {
    return latestReportAdapter.addMany(result, {
      ...state,
      loading: false,
    });
  }),
  on(LatestReportActions.loadLatestReportsFailure, LatestReportActions.loadMoreLatestReportsFailure, (state): State => {
    return { ...state, loading: false };
  }),
);

export const { selectAll, selectEntities, selectIds, selectTotal } = latestReportAdapter.getSelectors();
