import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EventDialogData, EventDialogViewModel } from '../../../models/event-dialog';
import { Event } from '../../../models/events';
import { EventDialogActions } from '../actions';

export interface EventDialogFeatureState {
  selectedEvent: Event;
  loading: boolean;
  data: EventDialogData;
}

export const eventDialogInitialState: EventDialogFeatureState = {
  selectedEvent: null,
  loading: true,
  data: null,
};

const reducer = createReducer(
  eventDialogInitialState,

  on(
    EventDialogActions.openDialog,
    (state, { selectedEvent }): EventDialogFeatureState => ({ ...state, selectedEvent }),
  ),

  on(
    EventDialogActions.fetchDataSuccess,
    (state, { data }): EventDialogFeatureState => ({ ...state, loading: false, data }),
  ),

  on(EventDialogActions.fetchDataFailure, (state): EventDialogFeatureState => ({ ...state, loading: false })),

  on(EventDialogActions.resetState, (): EventDialogFeatureState => eventDialogInitialState),
);

export const eventDialogFeature = createFeature({
  name: 'event-dialog',
  reducer,
  extraSelectors: ({ selectSelectedEvent, selectLoading, selectData }) => ({
    selectEventId: createSelector(selectSelectedEvent, (event): string => event.event_id),
    selectViewModel: createSelector(
      selectSelectedEvent,
      selectLoading,
      selectData,
      (event, loading, data): EventDialogViewModel => ({
        event,
        loading,
        data,
      }),
    ),
  }),
});
