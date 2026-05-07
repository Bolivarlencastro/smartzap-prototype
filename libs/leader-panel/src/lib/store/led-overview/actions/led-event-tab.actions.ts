import { createAction, props } from '@ngrx/store';
import { LedEventItem } from '../../../models/led-event-item';

const fetchEvents = createAction('[Led Event Tab] Fetch Events');

const fetchEventsSuccess = createAction('[Led Event Tab] Fetch Events Success', props<{ events: LedEventItem[] }>());

const fetchEventsFailure = createAction('[Led Event Tab] Fetch Events Failure');

export const LedEventTabActions = {
  fetchEvents,
  fetchEventsSuccess,
  fetchEventsFailure,
};
