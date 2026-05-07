import { LearnContentActions } from '@app/shared/store';
import { toggleBookmarkAction } from '@app/shared/utils/card-helpers';
import { QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EventsFilter, EventsViewModel } from '../../models/events';
import { EventsActions } from '../actions';

export interface EventsFeatureState extends EntityState<LearnContentCardData> {
  filter: EventsFilter;
  finished: boolean;
  loading: boolean;
}

export const adapter = createEntityAdapter<LearnContentCardData>({ selectId: (item) => item.contentId });

export const eventsInitialState: EventsFeatureState = adapter.getInitialState({
  filter: {
    page: 1,
    per_page: 15,
    type: QuickFilterType.HOME,
  },
  finished: false,
  loading: false,
});

export const eventsReducer = createReducer(
  eventsInitialState,

  on(
    EventsActions.loadEvents,
    (state): EventsFeatureState => adapter.removeAll({ ...state, loading: true, filter: { ...state.filter, page: 1 } }),
  ),

  on(
    EventsActions.loadEventsSuccess,
    (state, { events, finished }): EventsFeatureState =>
      adapter.setAll(events, {
        ...state,
        loading: false,
        finished,
      }),
  ),

  on(EventsActions.loadMoreEvents, (state): EventsFeatureState => {
    if (state.finished) {
      return state;
    }

    return { ...state, loading: true, filter: { ...state.filter, page: state.filter.page + 1 } };
  }),

  on(
    EventsActions.loadMoreEventsSuccess,
    (state, { events, finished }): EventsFeatureState =>
      adapter.addMany(events, {
        ...state,
        loading: false,
        finished,
      }),
  ),

  on(
    EventsActions.loadEventsFailure,
    EventsActions.loadMoreEventsFailure,
    (state): EventsFeatureState => ({ ...state, loading: false }),
  ),

  on(LearnContentActions.addBookmarkSuccess, (state, { learnContent, bookmarkId }): EventsFeatureState => {
    return adapter.updateOne(
      {
        id: learnContent.contentId,
        changes: {
          bookmarkId,
          actions: toggleBookmarkAction(learnContent.actions, 'add-bookmark', 'remove-bookmark'),
        },
      },
      state,
    );
  }),

  on(LearnContentActions.removeBookmarkSuccess, (state, { learnContent }): EventsFeatureState => {
    return adapter.updateOne(
      {
        id: learnContent.contentId,
        changes: {
          bookmarkId: undefined,
          actions: toggleBookmarkAction(learnContent.actions, 'remove-bookmark', 'add-bookmark'),
        },
      },
      state,
    );
  }),

  on(EventsActions.reset, (): EventsFeatureState => eventsInitialState),
);

export const eventsFeature = createFeature({
  name: 'events',
  reducer: eventsReducer,
  extraSelectors: ({ selectEventsState, selectLoading }) => ({
    selectEventsViewModel: createSelector(
      adapter.getSelectors(selectEventsState).selectAll,
      selectLoading,
      (events, loading): EventsViewModel => ({ events, loading }),
    ),
  }),
});
