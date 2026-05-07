import { createReducer, on } from '@ngrx/store';
import { UsersActions } from '../actions';
import { DatatableQuery, User, UsersFilter } from '../../model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Report, UserReports } from 'app/shared/model';

export const usersFeatureKey = 'users';
export interface State extends EntityState<User> {
  isLoading: boolean;
  datatableQuery: DatatableQuery;
  reportButtons: Report[];
  finished: boolean;
  filters: UsersFilter;
  availableTags: string[];
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

const initialFilters: UsersFilter = { tags: [], synced: [] };

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  reportButtons: UserReports,
  datatableQuery: {
    pagination: {
      page: 1,
      per_page: 10,
      total_pages: 0,
      count: 0,
    },
    searchTerm: '',
    sort: '',
  },
  finished: false,
  filters: initialFilters,
  availableTags: [],
});

export const reducer = createReducer(
  initialState,

  on(UsersActions.init, (): State => {
    return { ...initialState };
  }),

  on(UsersActions.loadUsers, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(UsersActions.loadUsersFailure, (state): State => {
    return { ...state, isLoading: false };
  }),

  on(UsersActions.removeUser, (state, { id }): State => adapter.removeOne(id, state)),

  on(UsersActions.loadUsersSuccess, (state, action): State => {
    const { page, total_pages, count, result } = action.data;
    let { datatableQuery } = state;

    datatableQuery = {
      ...datatableQuery,
      pagination: {
        page: page,
        total_pages,
        count,
        per_page: datatableQuery.pagination.per_page,
      },
    };

    const newTags = (result as User[])
      .flatMap((u) => (u.tags ? u.tags.split(',').map((t) => t.trim()) : []))
      .filter(Boolean);
    const availableTags = Array.from(new Set([...state.availableTags, ...newTags])).sort();

    return adapter.setAll(result, {
      ...state,
      datatableQuery,
      isLoading: false,
      finished: page === total_pages,
      availableTags,
    });
  }),

  on(UsersActions.toggleSelectUser, (state, { id, selected }): State => {
    const updatedState = adapter.updateOne({ id, changes: { selected } }, { ...state });
    return updatedState;
  }),

  on(UsersActions.updateUser, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(UsersActions.updateUserSuccess, (state, { user }): State => adapter.setOne(user, { ...state, isLoading: false })),

  on(UsersActions.updateUserFailure, (state): State => {
    return { ...state, isLoading: false };
  }),

  on(UsersActions.fetchMoreUsers, (state): State => {
    if (state.finished || state.isLoading) {
      return state;
    }
    return {
      ...state,
      datatableQuery: {
        ...state.datatableQuery,
        pagination: { ...state.datatableQuery.pagination, page: state.datatableQuery.pagination.page + 1 },
      },
    };
  }),

  on(UsersActions.searchUsers, (state, { searchTerm }): State => {
    return adapter.removeAll({
      ...state,
      datatableQuery: { ...state.datatableQuery, searchTerm },
      isLoading: true,
    });
  }),

  on(UsersActions.setUserPagination, (state, { currentPage, per_page }): State => {
    return {
      ...state,
      datatableQuery: {
        ...state.datatableQuery,
        pagination: {
          ...state.datatableQuery.pagination,
          page: currentPage,
          per_page,
        },
      },
    };
  }),

  on(UsersActions.sortUsers, (state, { sort }): State => {
    return adapter.removeAll({
      ...state,
      datatableQuery: { ...state.datatableQuery, sort },
      isLoading: true,
    });
  }),

  on(UsersActions.filterUsers, (state, { filters }): State => {
    return adapter.removeAll({
      ...state,
      filters,
      datatableQuery: {
        ...state.datatableQuery,
        pagination: { ...state.datatableQuery.pagination, page: 1 },
      },
      isLoading: true,
    });
  }),
);

// get the selectors
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
