import { createReducer, on } from '@ngrx/store';
import { UsersFilter } from '../../users.types';
import { UsersListActions } from '../actions';
import { UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

export const featureKey = 'usersList';

export interface UsersListState {
  users: UserProfile[] | null;
  isLoading: boolean;
  displayedColumns: string[];
  filter: UsersFilter;
}

export const initialState: UsersListState = {
  users: null,
  isLoading: false,
  displayedColumns: [],
  filter: {
    sort: null,
    pageEvent: {
      length: 0,
      pageIndex: 0,
      pageSize: 10,
      previousPageIndex: 0,
    },
    search: '',
    roleId: [],
    status: null,
    jobPositions: [],
  },
};

export const reducer = createReducer(
  initialState,

  on(
    UsersListActions.loadUsers,
    (state): UsersListState => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(UsersListActions.loadUsersSuccess, (state, { response: { data, meta } }): UsersListState => {
    return {
      ...state,
      users: data,
      isLoading: false,
      filter: { ...state.filter, pageEvent: { ...state.filter.pageEvent, length: meta.total_items } },
    };
  }),

  on(UsersListActions.toggleUserStatusSuccess, (state, { userId }): UsersListState => {
    const userIndex = state.users.findIndex((u) => u.id === userId);
    const usersCopy = structuredClone(state.users);

    usersCopy[userIndex].status = !usersCopy[userIndex].status;

    return {
      ...state,
      users: usersCopy,
    };
  }),

  on(UsersListActions.toggleUserStatusFailure, (state): UsersListState => {
    return {
      ...state,
      users: structuredClone(state.users),
    };
  }),

  on(UsersListActions.setDisplayedColumns, (state, { columns }): UsersListState => {
    return {
      ...state,
      displayedColumns: columns,
    };
  }),

  on(
    UsersListActions.search,
    (state, { search }): UsersListState => ({
      ...state,
      filter: {
        ...state.filter,
        search,
        pageEvent: { ...state.filter.pageEvent, pageIndex: 0 },
      },
    }),
  ),

  on(
    UsersListActions.filter,
    (state, { data }): UsersListState => ({
      ...state,
      filter: {
        ...state.filter,
        roleId: data.roleId ?? [],
        status: data.status ?? null,
        jobPositions: data.jobPositions ?? [],
        activityAreas: data.activityAreas ?? [],
        directors: data.directors ?? [],
        managers: data.managers ?? [],
        leadersId: data.leaders ?? [],
        pageEvent: { ...state.filter.pageEvent, pageIndex: 0 },
      },
    }),
  ),

  on(
    UsersListActions.changePage,
    (state, { pageEvent }): UsersListState => ({
      ...state,
      filter: {
        ...state.filter,
        pageEvent,
      },
    }),
  ),

  on(
    UsersListActions.sort,
    (state, { sort }): UsersListState => ({
      ...state,
      filter: {
        ...state.filter,
        sort,
        pageEvent: { ...state.filter.pageEvent, pageIndex: 0 },
      },
    }),
  ),

  on(UsersListActions.clear, (): UsersListState => ({ ...initialState })),
);
