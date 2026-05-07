import { Action, createReducer, on } from '@ngrx/store';

import { Enrollment, EnrollmentFilter } from '@core/model/enrollment.model';
import * as Actions from './mission-enrollments.actions';
import { SortDirection } from '@angular/material/sort';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

export interface MissionEnrollmentsState {
  enrollments: Enrollment[];
  enrollmentsByUser: Enrollment[];
  enrollment: Enrollment;
  filter: EnrollmentFilter;
  history: string;
  isLoading: boolean;
  filteringAllUsers: boolean | undefined;
  sort: { field: string; direction: SortDirection } | null;
  count: number;
  isFinished: boolean;
  statuses: KpFilterSelectOption[];
  isCourse: boolean;
  isContentCreator: boolean;
}

export const missionsDoneKey = 'mission-enrollments-app';

export const initialState: MissionEnrollmentsState = {
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
  isCourse: true,
  isContentCreator: false,
};

const missionsDoneReducer = createReducer(
  initialState,

  on(
    Actions.requestExtendDeadlineSuccess,
    Actions.deleteEnrollmentSuccess,
    Actions.giveUpEnrollmentSuccess,
    Actions.restartEnrollmentSuccess,
    Actions.reEnrollEnrollmentSuccess,
    Actions.approveEnrollmentSuccess,
    Actions.approveEnrollmentCertificateSuccess,
    Actions.extendGoalDateEnrollmentSuccess,
    Actions.setPresentialLiveApprovalSuccess,
    Actions.finishPresentialLiveSuccess,
    (state): MissionEnrollmentsState => {
      return {
        ...state,
        isLoading: true,
      };
    },
  ),

  on(Actions.loadEnrollments, (state): MissionEnrollmentsState => ({ ...state, isLoading: true })),

  on(
    Actions.setFilteringAllUsers,
    (state, { filteringAllUsers, isCourse, isContentCreator }): MissionEnrollmentsState => ({
      ...state,
      filteringAllUsers,
      isCourse,
      isContentCreator,
    }),
  ),

  on(
    Actions.saveFilter,
    (state, { filter }): MissionEnrollmentsState => ({
      ...state,
      filter: { ...filter, page: 1, per_page: state.filter.per_page, search: state.filter.search },
    }),
  ),

  on(
    Actions.searchChange,
    (state, { search }): MissionEnrollmentsState => ({
      ...state,
      filter: { ...state.filter, page: 1, search },
    }),
  ),

  on(
    Actions.paginationChange,
    (state, { page, per_page }): MissionEnrollmentsState => ({
      ...state,
      filter: { ...state.filter, page, per_page },
    }),
  ),

  on(
    Actions.sortChange,
    (state, { field, direction }): MissionEnrollmentsState => ({
      ...state,
      filter: { ...state.filter, page: 1 },
      sort: { field, direction },
    }),
  ),

  on(Actions.loadEnrollmentsSuccess, (state, { enrollments, count, next }): MissionEnrollmentsState => {
    return {
      ...state,
      enrollments,
      isLoading: false,
      isFinished: !next,
      count,
    };
  }),

  on(Actions.loadEnrollmentsFailure, (state): MissionEnrollmentsState => {
    return {
      ...state,
      isLoading: false,
    };
  }),

  on(Actions.setEnrollment, (state, { enrollment }): MissionEnrollmentsState => {
    return {
      ...state,
      enrollment,
    };
  }),

  on(Actions.loadEnrollmentsByUserSuccess, (state, { payload }): MissionEnrollmentsState => {
    return {
      ...state,
      enrollmentsByUser: payload,
    };
  }),

  on(Actions.loadEnrollmentHistorySuccess, (state, { approve_msg }): MissionEnrollmentsState => {
    return {
      ...state,
      history: approve_msg,
    };
  }),

  on(Actions.resetEnrollments, (): MissionEnrollmentsState => initialState),

  on(Actions.resetEnrollmentHistory, (state): MissionEnrollmentsState => {
    return {
      ...state,
      history: '',
    };
  }),

  on(
    Actions.fetchMoreItems,
    (state): MissionEnrollmentsState =>
      state.isFinished ? state : { ...state, filter: { ...state.filter, page: state.filter.page + 1 } },
  ),

  on(Actions.fetchMoreItemsSuccess, (state, { enrollments, count, next }): MissionEnrollmentsState => {
    return {
      ...state,
      enrollments: state.enrollments.concat(enrollments),
      count,
      isFinished: !next,
    };
  }),

  on(Actions.fetchStatusOptionsSuccess, (state, { statuses }): MissionEnrollmentsState => ({ ...state, statuses })),
);

// General
export function reducer(state: MissionEnrollmentsState | undefined, action: Action) {
  return missionsDoneReducer(state, action);
}
