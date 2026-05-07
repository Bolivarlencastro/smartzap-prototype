import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { GlobalSearchActions } from '../actions';
import { GlobalSearchItem } from '@keeps-platform-frontend-workspace/ui/kp-global-search-item';
import {
  GlobalSearchFilter,
  GlobalSearchFilterOptions,
} from '@keeps-platform-frontend-workspace/ui/kp-global-search-side-filter';
import { ContentTypeTab, ContentTypeTabs } from '@keeps-platform-frontend-workspace/ui/kp-global-search-list';

export const globalSearchFeatureKey = 'global-search';

export interface State extends EntityState<GlobalSearchItem> {
  count: number;
  loading: boolean;
  loadingMore: boolean;
  filter: GlobalSearchFilter;
  isFinished: boolean;
  filterOptions: GlobalSearchFilterOptions;
  tabs: ContentTypeTab[];
}

export const itemsAdapter: EntityAdapter<GlobalSearchItem> = createEntityAdapter<GlobalSearchItem>();

export const globalSearchInitialState: State = itemsAdapter.getInitialState({
  count: 0,
  loading: false,
  loadingMore: false,
  filter: {
    page: 1,
    per_page: 20,
    search: '',
    contentType: ContentTypeTabs.ALL,
  },
  isFinished: false,
  filterOptions: null,
  tabs: [],
});

export const globalSearchReducers = createReducer(
  globalSearchInitialState,

  on(GlobalSearchActions.openDialog, (state): State => {
    return { ...state, loading: true };
  }),

  on(GlobalSearchActions.getTabs, (state, { tabs }): State => {
    return { ...state, tabs };
  }),

  on(GlobalSearchActions.loadItems, (state): State => {
    return itemsAdapter.removeAll({ ...state, loading: true });
  }),

  on(GlobalSearchActions.loadItemsSuccess, (state, { response }): State => {
    const { count, next, items } = response;
    return itemsAdapter.setAll(items || [], {
      ...state,
      count: count,
      loading: false,
      isFinished: !next,
    });
  }),

  on(GlobalSearchActions.loadItemsFailure, (state): State => {
    return { ...state, loading: false };
  }),

  on(GlobalSearchActions.updateFilter, (state, { filter, filterOptions }): State => {
    const updatedFilter = { ...state.filter, ...filter, page: 1 };
    return {
      ...state,
      filter: updatedFilter,
      filterOptions: filterOptions ?? state.filterOptions,
    };
  }),

  on(GlobalSearchActions.cleanFilter, (state): State => {
    return {
      ...state,
      filter: {
        ...globalSearchInitialState.filter,
        search: state.filter.search,
        contentType: state.filter.contentType,
      },
    };
  }),

  on(
    GlobalSearchActions.fetchMoreItems,
    (state): State =>
      state.isFinished
        ? state
        : { ...state, filter: { ...state.filter, page: state.filter.page + 1 }, loadingMore: true },
  ),

  on(GlobalSearchActions.fetchMoreItemsSuccess, (state, { response }): State => {
    const { next, items } = response;
    return itemsAdapter.addMany(items || [], {
      ...state,
      isFinished: !next,
      loadingMore: false,
    });
  }),

  on(GlobalSearchActions.fetchMoreItemsFailure, (state): State => {
    return { ...state, loadingMore: false };
  }),

  on(GlobalSearchActions.resetState, (): State => globalSearchInitialState),
);

export const { selectAll } = itemsAdapter.getSelectors();
