import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { SimpleFilterListItem, SimpleFilterReportModel } from '../../interfaces';
import { CoursesFilterListActions } from '../actions';

export const featureKey = 'coursesFilterList';
export interface State extends EntityState<SimpleFilterListItem> {
  loading: boolean;
  filter: SimpleFilterReportModel;
  loaded: boolean;
}

export const adapter: EntityAdapter<SimpleFilterListItem> = createEntityAdapter<SimpleFilterListItem>({
  selectId: (item) => item.id,
});

export const initialState: State = adapter.getInitialState({
  loaded: true,
  loading: false,
  filter: { page: 1, search: '', reportType: undefined },
});

export const reducer = createReducer(
  initialState,
  on(CoursesFilterListActions.searchItems, (state, { filter }): State => {
    return adapter.removeAll({ ...state, loading: true, filter });
  }),
  on(CoursesFilterListActions.loadFilterItems, (state, { filter }): State => {
    return { ...state, loading: true, filter };
  }),
  on(CoursesFilterListActions.loadFilterItemsSuccess, (state, { items, loaded }): State => {
    return adapter.addMany(items, { ...state, loading: false, loaded });
  }),
  on(CoursesFilterListActions.searchItemsSuccess, (state, { items, loaded }): State => {
    return adapter.setAll(items, { ...state, loading: false, loaded });
  }),
  on(CoursesFilterListActions.clear, (): State => {
    return { ...initialState };
  }),
  on(CoursesFilterListActions.searchItemsFailure, CoursesFilterListActions.loadFilterItemsFailure, (state): State => {
    return { ...state, loading: false };
  }),
);
