import { Injectable } from '@angular/core';
import { UserProfileSelectors } from '@app/shared/store/selectors';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { EventsActions, HomeActions } from '../actions';
import { eventsFeature } from '../features';

@Injectable()
export class EventsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly eventsService: EventsService,
  ) {}

  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.loadSections),
      map(({ id }) => (id === 'events' ? EventsActions.loadEvents() : EventsActions.reset())),
    );
  });

  loadEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.loadEvents),
      concatLatestFrom(() => [
        this.store.select(eventsFeature.selectFilter),
        this.store.select(UserProfileSelectors.selectIsSuperAdmin),
        this.store.select(UserProfileSelectors.selectIsAdmin),
      ]),
      switchMap(([_, filter, isSuperAdmin, isAdmin]) =>
        this.eventsService.loadEvents(filter, isSuperAdmin, isAdmin).pipe(
          map(({ events, finished }) => EventsActions.loadEventsSuccess({ events, finished })),
          catchError(() => of(EventsActions.loadEventsFailure())),
        ),
      ),
    );
  });

  loadMoreEvents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.loadMoreEvents),
      concatLatestFrom(() => [
        this.store.select(eventsFeature.selectFilter),
        this.store.select(eventsFeature.selectFinished),
        this.store.select(UserProfileSelectors.selectIsSuperAdmin),
        this.store.select(UserProfileSelectors.selectIsAdmin),
      ]),
      filter(([_, _filter, finished]) => !finished),
      switchMap(([_, filter, _finished, isSuperAdmin, isAdmin]) =>
        this.eventsService.loadEvents(filter, isSuperAdmin, isAdmin).pipe(
          map(({ events, finished }) => EventsActions.loadMoreEventsSuccess({ events, finished })),
          catchError(() => of(EventsActions.loadMoreEventsFailure())),
        ),
      ),
    );
  });
}
