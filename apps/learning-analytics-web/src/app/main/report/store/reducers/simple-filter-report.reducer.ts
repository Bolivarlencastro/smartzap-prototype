import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { SimpleFilterListItem, SimpleFilterReportModel } from '../../interfaces';
import { SimpleFilterReportActions } from '../actions';

export const featureKey = 'simpleFilterReport';
export interface State extends EntityState<SimpleFilterListItem> {
  loading: boolean;
  filter: SimpleFilterReportModel;
  loaded: boolean;
  count: number;
}

export const adapter: EntityAdapter<SimpleFilterListItem> = createEntityAdapter<SimpleFilterListItem>({
  selectId: (item) => item.id,
});

export const initialState: State = adapter.getInitialState({
  loaded: true,
  loading: false,
  count: 0,
  filter: { page: 1, search: '', reportType: undefined },
});

export const reducer = createReducer(
  initialState,
  on(SimpleFilterReportActions.searchItems, (state, { filter }): State => {
    return adapter.removeAll({ ...state, loading: true, filter });
  }),
  on(SimpleFilterReportActions.loadFilterItems, (state, { filter }): State => {
    return { ...state, loading: true, filter };
  }),
  on(SimpleFilterReportActions.loadFilterItemsSuccess, (state, { items, loaded, count }): State => {
    return adapter.addMany(items, { ...state, loading: false, loaded, count });
  }),
  on(SimpleFilterReportActions.searchItemsSuccess, (state, { items, loaded, count }): State => {
    return adapter.setAll(items, { ...state, loading: false, loaded, count });
  }),
  on(SimpleFilterReportActions.clear, (): State => {
    return { ...initialState };
  }),
  on(SimpleFilterReportActions.searchItemsFailure, SimpleFilterReportActions.loadFilterItemsFailure, (state): State => {
    return { ...state, loading: false };
  }),
);
