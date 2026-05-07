import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { EventManagementActionsService } from '../../services/event-management-actions.service';
import { EventManagementService } from '../../services/event-management.service';
import { EventManagementActions, EventManagementUserActions, ImportListActions } from '../actions';
import { eventManagementFeature } from '../features';
import { BatchEnrollmentsActions } from 'app/shared/components/batch-enrollment-dialog';
import { filter } from 'rxjs/operators';

@Injectable()
export class EventManagementEffects {
  loadEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventManagementActions.init, EventManagementActions.loadEvent),
      concatLatestFrom(() => this.store.select(eventManagementFeature.selectEventId)),
      switchMap(([_, eventId]) =>
        this.eventManagementService
          .loadEvent(eventId)
          .pipe(map((event) => EventManagementActions.loadEventSuccess({ event }))),
      ),
    );
  });

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventManagementActions.loadUsers),
      concatLatestFrom(() => [
        this.store.select(eventManagementFeature.selectFilter),
        this.store.select(eventManagementFeature.selectEvent),
      ]),
      switchMap(([_, filter, event]) =>
        this.eventManagementService
          .loadUsers(filter, event.mission_model)
          .pipe(map((users) => EventManagementActions.loadUsersSuccess({ users }))),
      ),
    );
  });

  executeAction$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(EventManagementActions.dispatchAction),
        concatLatestFrom(() => [
          this.store.select(eventManagementFeature.selectEvent),
          this.store.select(eventManagementFeature.selectEventDates),
        ]),
        map(([{ action }, event, dates]) => this.eventManagementActionsService.executeAction(action, event, dates)),
      );
    },
    { dispatch: false },
  );

  enrollUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventManagementActions.enrollUsers),
      concatLatestFrom(() => [this.store.select(eventManagementFeature.selectEvent)]),
      map(([{ remainingSeats }, event]) =>
        BatchEnrollmentsActions.openDialog({ learningContentId: event.id, enrollmentType: 'event', remainingSeats }),
      ),
    );
  });

  enrollUsersSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BatchEnrollmentsActions.batchEnrollmentSuccess),
      concatLatestFrom(() => this.store.select(eventManagementFeature.selectEvent)),
      filter(([_, event]) => !!event?.id),
      map(() => EventManagementActions.loadUsers()),
    );
  });

  reloadEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        EventManagementUserActions.removeUserSuccess,
        EventManagementUserActions.togglePresenceSuccess,
        ImportListActions.confirmImportSuccess,
      ),
      map(() => EventManagementActions.loadEvent()),
    );
  });

  reloadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        EventManagementActions.setFilter,
        EventManagementUserActions.removeUserSuccess,
        EventManagementUserActions.addNoteSuccess,
        ImportListActions.confirmImportSuccess,
        EventManagementUserActions.sendInviteSuccess,
      ),
      map(() => EventManagementActions.loadUsers()),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly eventManagementService: EventManagementService,
    private readonly eventManagementActionsService: EventManagementActionsService,
  ) {}
}
