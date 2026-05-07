import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { EventsLeaderApi } from '../../../services/events-leader.api';
import { EventListActions } from '../actions';
import { eventListFeature } from '../features';

@Injectable()
export class EventListEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(EventListActions.init),
      concatLatestFrom(() => this.store.select(eventListFeature.selectLoaded)),
      filter(([_, loaded]) => !loaded),
      map(() => EventListActions.fetchEvents()),
    );
  });

  fetchEvents$ = createEffect(() => {
    return this.actions.pipe(
      ofType(EventListActions.fetchEvents),
      concatLatestFrom(() => this.store.select(eventListFeature.selectFilter)),
      switchMap(([_, filter]) =>
        this.eventsApi.getEvents(filter).pipe(
          map((response) => EventListActions.fetchEventsSuccess({ response })),
          catchError(() => of(EventListActions.fetchEventsFailure())),
        ),
      ),
    );
  });

  reloadEvents$ = createEffect(() => {
    return this.actions.pipe(
      ofType(EventListActions.search, EventListActions.sort, EventListActions.setPagination),
      map(() => EventListActions.fetchEvents()),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly eventsApi: EventsLeaderApi,
    private readonly store: Store,
  ) {}
}
