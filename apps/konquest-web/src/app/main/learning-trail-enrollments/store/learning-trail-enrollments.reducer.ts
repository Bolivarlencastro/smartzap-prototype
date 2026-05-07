import { Action, createReducer, on } from '@ngrx/store';

import { Enrollment, EnrollmentFilter } from '@core/model/enrollment.model';
import * as Actions from './learning-trail-enrollments.actions';
import { SortDirection } from '@angular/material/sort';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

export interface LearningTrailEnrollmentsState {
  enrollments: Enrollment[];
  enrollmentsByUser: Enrollment[];
  enrollment: Enrollment;
  filter: EnrollmentFilter;
  history: string;
  isLoading: boolean;
  filteringAllUsers: boolean;
  sort: { field: string; direction: SortDirection } | null;
  count: number;
  isFinished: boolean;
  statuses: KpFilterSelectOption[];
  isContentCreator: boolean;
}

export const learningTrailDoneKey = 'learning-trail-enrollments-app';

export const initialState: LearningTrailEnrollmentsState = {
  enrollments: [],
  enrollmentsByUser: [],
  enrollment: {} as Enrollment,
  filter: { page: 1, per_page: 10 },
  history: '',
  isLoading: false,
  filteringAllUsers: true,
  sort: null,
  count: 0,
  isFinished: false,
  statuses: [],
  isContentCreator: false,
};

const learningTrailDoneReducer = createReducer(
  initialState,

  on(
    Actions.deleteEnrollmentSuccess,
    Actions.reEnrollEnrollmentSuccess,
    Actions.approveEnrollmentSuccess,
    (state): LearningTrailEnrollmentsState => {
      return {
        ...state,
        isLoading: true,
      };
    },
  ),

  on(Actions.loadEnrollments, (state): LearningTrailEnrollmentsState => ({ ...state, isLoading: true })),

  on(
    Actions.setFilteringAllUsers,
    (state, { filteringAllUsers, isContentCreator }): LearningTrailEnrollmentsState => ({
      ...state,
      filteringAllUsers: !!filteringAllUsers,
      isContentCreator,
    }),
  ),

  on(
    Actions.saveFilter,
    (state, { filter }): LearningTrailEnrollmentsState => ({
      ...state,
      filter: { ...filter, page: 1, per_page: state.filter.per_page, search: state.filter.search },
    }),
  ),

  on(
    Actions.searchChange,
    (state, { search }): LearningTrailEnrollmentsState => ({
      ...state,
      filter: { ...state.filter, page: 1, search },
    }),
  ),

  on(
    Actions.paginationChange,
    (state, { page, per_page }): LearningTrailEnrollmentsState => ({
      ...state,
      filter: { ...state.filter, page, per_page },
    }),
  ),

  on(
    Actions.sortChange,
    (state, { field, direction }): LearningTrailEnrollmentsState => ({
      ...state,
      filter: { ...state.filter, page: 1 },
      sort: { field, direction },
    }),
  ),

  on(Actions.loadEnrollmentsSuccess, (state, { enrollments, count, next }): LearningTrailEnrollmentsState => {
    return {
      ...state,
      enrollments,
      isLoading: false,
      isFinished: !next,
      count: count || 0,
    };
  }),

  on(Actions.loadEnrollmentsFailure, (state): LearningTrailEnrollmentsState => {
    return {
      ...state,
      isLoading: false,
    };
  }),

  on(Actions.setEnrollment, (state, { enrollment }): LearningTrailEnrollmentsState => {
    return {
      ...state,
      enrollment,
    };
  }),

  on(Actions.loadEnrollmentsByUserSuccess, (state, { payload }): LearningTrailEnrollmentsState => {
    return {
      ...state,
      enrollmentsByUser: payload,
    };
  }),

  on(Actions.resetEnrollments, (): LearningTrailEnrollmentsState => initialState),

  on(Actions.resetEnrollmentHistory, (state): LearningTrailEnrollmentsState => {
    return {
      ...state,
      history: '',
    };
  }),

  on(
    Actions.fetchMoreItems,
    (state): LearningTrailEnrollmentsState =>
      state.isFinished ? state : { ...state, filter: { ...state.filter, page: state.filter.page + 1 } },
  ),

  on(Actions.fetchMoreItemsSuccess, (state, { enrollments, count, next }): LearningTrailEnrollmentsState => {
    return {
      ...state,
      enrollments: state.enrollments.concat(enrollments),
      count,
      isFinished: !next,
    };
  }),

  on(
    Actions.fetchStatusOptionsSuccess,
    (state, { statuses }): LearningTrailEnrollmentsState => ({ ...state, statuses }),
  ),
);

// General
export function reducer(state: LearningTrailEnrollmentsState | undefined, action: Action) {
  return learningTrailDoneReducer(state, action);
}
