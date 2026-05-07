import { SortDirection } from '@angular/material/sort';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Enrollment } from 'app/main/courses/model';
import { Tracking } from 'app/main/courses/model/tracking';
import { Page } from 'app/shared/model';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';
import { EnrollmentsActions } from '../actions';

export const featureKey = 'enrollments';

export interface EnrollmentsStatistics {
  totalUsers: number;
  totalSentMessages: number;
  startedEnrollments: number;
  waitingEnrollments: number;
  totalPendingMessages: number;
  totalSentMessagesPeriod: number;
}

export interface State extends EntityState<Enrollment> {
  isLoading: boolean;
  page: Page;
  sort: { field: string; direction: SortDirection };
  enrollmentTracking: Tracking[];
  isLoadingEnrollmentTracking: boolean;
  filter: EnrollmentFilter;
  statistics: EnrollmentsStatistics;
}

export const adapter: EntityAdapter<Enrollment> = createEntityAdapter<Enrollment>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  page: {
    count: 0,
    per_page: 10,
    page: 1,
    total_pages: 0,
  },
  sort: {
    field: 'created',
    direction: 'desc',
  },
  enrollmentTracking: [],
  isLoadingEnrollmentTracking: false,
  filter: {},
  statistics: {
    totalUsers: 0,
    totalSentMessages: 0,
    startedEnrollments: 0,
    waitingEnrollments: 0,
    totalPendingMessages: 0,
    totalSentMessagesPeriod: 0,
  },
});

export const reducer = createReducer(
  initialState,

  on(EnrollmentsActions.loadEnrollmentsAndStatistics, (state): State => {
    return adapter.removeAll({
      ...state,
      isLoading: true,
    });
  }),

  on(EnrollmentsActions.loadEnrollmentsSuccess, (state, { payload }): State => {
    const { page, collection } = payload;
    return adapter.setAll(collection, { ...state, page, isLoading: false });
  }),

  on(EnrollmentsActions.loadEnrollmentsFailure, (state): State => {
    return { ...state, isLoading: false };
  }),

  on(EnrollmentsActions.setPagination, (state, { payload }): State => {
    return { ...state, page: { ...state.page, page: payload.page, per_page: payload.perPage } };
  }),

  on(EnrollmentsActions.setSort, (state, { payload }): State => {
    return { ...state, sort: { field: payload.field, direction: payload.direction } };
  }),

  on(EnrollmentsActions.setFilter, (state, { payload }): State => {
    return { ...state, filter: payload, page: { ...state.page, page: 1 } };
  }),

  on(EnrollmentsActions.loadStatisticsSuccess, (state, { payload }): State => {
    return { ...state, statistics: payload };
  }),

  on(EnrollmentsActions.deleteEnrollmentSuccess, (state, { payload }): State => {
    return adapter.removeOne(payload, state);
  }),

  on(EnrollmentsActions.cancelEnrollmentSuccess, (state, { payload }): State => {
    return adapter.updateOne(payload, state);
  }),

  on(EnrollmentsActions.reenrollSuccess, (state, { payload }): State => {
    const enrollments = selectAll(state);
    return adapter.setAll([payload, ...enrollments], state);
  }),

  on(EnrollmentsActions.loadEnrollmentTracking, (state): State => {
    return { ...state, isLoadingEnrollmentTracking: true, enrollmentTracking: [] };
  }),

  on(EnrollmentsActions.loadEnrollmentTrackingSuccess, (state, { payload }): State => {
    return { ...state, enrollmentTracking: payload, isLoadingEnrollmentTracking: false };
  }),

  on(EnrollmentsActions.loadEnrollmentTrackingFailure, (state): State => {
    return { ...state, isLoadingEnrollmentTracking: false };
  }),

  on(EnrollmentsActions.resetState, (): State => initialState),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
