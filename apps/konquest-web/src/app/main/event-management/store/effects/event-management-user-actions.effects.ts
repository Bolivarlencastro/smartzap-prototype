import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs';
import { EventManagementUserActionsService } from '../../services/event-management-user-actions.service';
import { EventManagementActions, EventManagementUserActions } from '../actions';
import { eventManagementFeature } from '../features';

@Injectable()
export class EventManagementUserActionsEffects {
  addNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventManagementUserActions.addNote),
      concatLatestFrom(() => this.store.select(eventManagementFeature.selectEvent)),
      switchMap(([{ presenceId, observation, batch }, event]) =>
        this.userActionsService
          .addNote(presenceId, observation, event?.mission_model, batch)
          .pipe(map(() => EventManagementUserActions.addNoteSuccess())),
      ),
    );
  });

  togglePresence$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventManagementUserActions.togglePresence),
      concatLatestFrom(() => this.store.select(eventManagementFeature.selectEvent)),
      switchMap(([{ checked, presenceId, batch }, event]) =>
        this.userActionsService
          .togglePresence(checked, presenceId, event?.mission_model, batch)
          .pipe(map(() => EventManagementUserActions.togglePresenceSuccess({ batch }))),
      ),
    );
  });

  togglePresenceSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventManagementUserActions.togglePresenceSuccess),
      filter(({ batch }) => batch),
      map(() => EventManagementActions.loadUsers()),
    );
  });

  removeUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventManagementUserActions.removeUser),
      switchMap(({ enrollmentId, batch }) =>
        this.userActionsService
          .removeUser(enrollmentId, batch)
          .pipe(map(() => EventManagementUserActions.removeUserSuccess())),
      ),
    );
  });

  sendInvite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventManagementUserActions.sendInvite),
      switchMap(({ enrollmentId }) =>
        this.userActionsService
          .sendInvite(enrollmentId)
          .pipe(map(() => EventManagementUserActions.sendInviteSuccess())),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly userActionsService: EventManagementUserActionsService,
  ) {}
}
