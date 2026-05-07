import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { SortDirection } from '@angular/material/sort';
import { Enrollment } from 'app/main/courses/model';
import { EnrollmentFilter } from 'app/shared/services/enrollments.service';
import { Page } from 'app/shared/model';
import { EnrollmentsActions } from '../actions';

export const featureKey = 'enrollments';

export interface State extends EntityState<Enrollment> {
  isLoading: boolean;
  page: Page;
  sort: { field: string; direction: SortDirection };
  filter: EnrollmentFilter;
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
  filter: {},
});

export const reducer = createReducer(
  initialState,

  on(EnrollmentsActions.clear, (): State => {
    return { ...initialState };
  }),

  on(EnrollmentsActions.loadEnrollments, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(EnrollmentsActions.loadEnrollmentsFailure, (state): State => {
    return { ...state, isLoading: false };
  }),

  on(EnrollmentsActions.sortEnrollments, (state, { field, direction }): State => {
    return adapter.removeAll({
      ...state,
      page: initialState.page,
      sort: { field, direction },
    });
  }),

  on(EnrollmentsActions.setPage, (state, { page }): State => {
    return { ...state, page };
  }),

  on(EnrollmentsActions.setFilter, (state, { filter }): State => {
    return adapter.removeAll({
      ...state,
      filter,
      page: initialState.page,
    });
  }),

  on(EnrollmentsActions.refreshEnrollments, (state): State => {
    return adapter.removeAll(state);
  }),

  on(EnrollmentsActions.loadEnrollmentsSuccess, (state, { payload }): State => {
    const { page, collection } = payload;
    return adapter.addMany(collection, { ...state, page, isLoading: false });
  }),

  on(EnrollmentsActions.removeEnrollmentSuccess, (state, { id }): State => adapter.removeOne(id, state)),

  on(EnrollmentsActions.cancelEnrollmentSuccess, (state, { enrollment }): State => {
    const { id, ...changes } = enrollment;
    return adapter.updateOne({ id: id || '', changes }, state);
  }),

  on(EnrollmentsActions.reenrollSuccess, (state, { enrollment }): State => {
    const enrollments = selectAll(state);
    return adapter.setAll([enrollment, ...enrollments], state);
  }),

  on(EnrollmentsActions.resetPage, (state): State => adapter.removeAll({ ...state, page: initialState.page })),
);

// get the selectors
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
