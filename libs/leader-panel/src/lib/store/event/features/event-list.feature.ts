import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ListFilter, ListViewModel } from '../../../models/list';
import { Event } from '../../../models/events';
import { EventListActions } from '../actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const EVENTS_LIST_FEATURE_KEY = 'lpEventsList';

export interface EventListFeatureState extends EntityState<Event> {
  loading: boolean;
  filter: ListFilter;
  count: number;
}

const adapter: EntityAdapter<Event> = createEntityAdapter<Event>({ selectId: (e) => e.event_id });

export const eventListInitialState: EventListFeatureState = adapter.getInitialState({
  loading: false,
  filter: { page: 1, per_page: 10 },
  count: null,
});

export const eventListReducer = createReducer(
  eventListInitialState,

  on(EventListActions.fetchEvents, (state): EventListFeatureState => ({ ...state, loading: true })),

  on(EventListActions.fetchEventsSuccess, (state, { response }): EventListFeatureState => {
    return adapter.setAll(response.items, { ...state, loading: false, count: response.total });
  }),

  on(EventListActions.fetchEventsFailure, (state): EventListFeatureState => ({ ...state, loading: false })),

  on(
    EventListActions.search,
    (state, { search }): EventListFeatureState => ({ ...state, filter: { ...state.filter, search, page: 1 } }),
  ),

  on(
    EventListActions.sort,
    (state, { sort }): EventListFeatureState => ({ ...state, filter: { ...state.filter, sort } }),
  ),

  on(
    EventListActions.setPagination,
    (state, { page, per_page }): EventListFeatureState => ({ ...state, filter: { ...state.filter, page, per_page } }),
  ),
);

export const eventListFeature = createFeature({
  name: EVENTS_LIST_FEATURE_KEY,
  reducer: eventListReducer,
  extraSelectors: ({ selectLpEventsListState, selectLoading, selectFilter, selectCount }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectLpEventsListState).selectAll,
      selectLoading,
      selectFilter,
      selectCount,
      (events, loading, filter, count): ListViewModel<Event> => ({
        data: events,
        loading,
        filter,
        count,
      }),
    ),
    selectLoaded: createSelector(adapter.getSelectors(selectLpEventsListState).selectAll, (items) => !!items?.length),
  }),
});
