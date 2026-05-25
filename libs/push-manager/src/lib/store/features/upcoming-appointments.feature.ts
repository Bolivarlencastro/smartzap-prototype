import { PushCampaignModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { UpcomingAppointmentsActions } from '../actions/upcoming-appointments.actions';

export const adapter = createEntityAdapter<PushCampaignModel>();

export interface UpcomingAppointmentsState extends EntityState<PushCampaignModel> {
  total: number;
  loading: boolean;
  loaded: boolean;
  page: number;
  limit: number;
  search: string;
  sortBy: string[];
}

export interface UpcomingAppointmentsViewModel extends Omit<UpcomingAppointmentsState, 'ids' | 'entities'> {
  data: PushCampaignModel[];
}

export const upcomingAppointmentsInitialState: UpcomingAppointmentsState = adapter.getInitialState({
  total: 0,
  loading: false,
  loaded: false,
  page: 1,
  limit: 10,
  search: '',
  sortBy: [],
});

const reducer = createReducer(
  upcomingAppointmentsInitialState,

  on(UpcomingAppointmentsActions.load, (state): UpcomingAppointmentsState => ({ ...state, loading: true })),

  on(
    UpcomingAppointmentsActions.search,
    (state, { search }): UpcomingAppointmentsState => ({ ...state, search, page: 1, loading: true }),
  ),

  on(
    UpcomingAppointmentsActions.sort,
    (state, { sortBy }): UpcomingAppointmentsState => ({ ...state, sortBy, page: 1, loading: true }),
  ),

  on(
    UpcomingAppointmentsActions.changePage,
    (state, { page, limit }): UpcomingAppointmentsState => ({ ...state, page, limit, loading: true }),
  ),

  on(
    UpcomingAppointmentsActions.loadSuccess,
    (state, { data, total }): UpcomingAppointmentsState =>
      adapter.setAll(data, { ...state, total, loading: false, loaded: true }),
  ),

  on(UpcomingAppointmentsActions.loadFailure, (state): UpcomingAppointmentsState => ({ ...state, loading: false })),

  on(
    UpcomingAppointmentsActions.cancelPushSuccess,
    (state, { id }): UpcomingAppointmentsState => adapter.removeOne(id, { ...state, total: state.total - 1 }),
  ),
);

export const upcomingAppointmentsFeature = createFeature({
  name: 'pmUpcomingAppointments',
  reducer,
  extraSelectors: ({ selectPmUpcomingAppointmentsState, selectPage, selectLimit, selectSearch, selectSortBy }) => {
    const { selectAll } = adapter.getSelectors(selectPmUpcomingAppointmentsState);
    return {
      selectFilters: createSelector(
        selectPage,
        selectLimit,
        selectSearch,
        selectSortBy,
        (page, limit, search, sortBy) => ({ page, limit, search, sortBy }),
      ),
      selectAppointmentsView: createSelector(
        selectPmUpcomingAppointmentsState,
        selectAll,
        (state, data): UpcomingAppointmentsViewModel => ({
          data,
          total: state.total,
          loading: state.loading,
          loaded: state.loaded,
          page: state.page,
          limit: state.limit,
          search: state.search,
          sortBy: state.sortBy,
        }),
      ),
    };
  },
});
